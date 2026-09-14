#!/usr/bin/env bash

set -euo pipefail

requiredVariables=(PORTAINER_URL PORTAINER_API_TOKEN PORTAINER_STACK_NAME API_IMAGE)

for variableName in "${requiredVariables[@]}"; do
  if [[ -z "${!variableName:-}" ]]; then
    echo "Missing required variable: ${variableName}" >&2
    exit 1
  fi
done

if [[ ! "${API_IMAGE}" =~ ^ghcr\.io/[a-z0-9._/-]+:[a-z0-9._-]+$ ]]; then
  echo "API_IMAGE must be a lowercase GHCR image reference." >&2
  exit 1
fi

portainerUrl="${PORTAINER_URL%/}"
apiHeaders=(
  -H "X-API-Key: ${PORTAINER_API_TOKEN}"
  -H "Content-Type: application/json"
)

stackJson="$(curl --fail --insecure --silent --show-error "${apiHeaders[@]}" "${portainerUrl}/api/stacks")"
stackJson="$(jq --compact-output --arg stackName "${PORTAINER_STACK_NAME}" '.[] | select(.Name == $stackName)' <<<"${stackJson}")"

if [[ -z "${stackJson}" ]]; then
  echo "Portainer stack not found: ${PORTAINER_STACK_NAME}" >&2
  exit 1
fi

stackId="$(jq --raw-output '.Id' <<<"${stackJson}")"
endpointId="$(jq --raw-output '.EndpointId' <<<"${stackJson}")"
stackEnvironment="$(jq --compact-output '.Env // []' <<<"${stackJson}")"
stackFile="$(curl --fail --insecure --silent --show-error "${apiHeaders[@]}" "${portainerUrl}/api/stacks/${stackId}/file")"

updatedStackFile="$(sed -E "0,/^([[:space:]]*image:[[:space:]]*).*/s//\\1${API_IMAGE}/" <<<"${stackFile}")"

if [[ "${stackFile}" == "${updatedStackFile}" ]]; then
  echo "No image declaration was updated in stack ${PORTAINER_STACK_NAME}." >&2
  exit 1
fi

updatePayload="$(jq --null-input \
  --arg stackFileContent "${updatedStackFile}" \
  --argjson environment "${stackEnvironment}" \
  '{StackFileContent: $stackFileContent, Env: $environment, Prune: false, PullImage: true}')"

curl --fail --insecure --silent --show-error --output /dev/null --request PUT \
  "${apiHeaders[@]}" \
  --data "${updatePayload}" \
  "${portainerUrl}/api/stacks/${stackId}?endpointId=${endpointId}"

echo "Redeployed Portainer stack ${PORTAINER_STACK_NAME} with ${API_IMAGE}."
