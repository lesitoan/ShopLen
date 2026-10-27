set -euo pipefail
: "${API_NEST_IMAGE:?Set API_NEST_IMAGE}"
containerId="$(docker run --detach --init --network none -e DATABASE_URL=postgresql://smoke:smoke@127.0.0.1:1/smoke -e REDIS_URL=redis://127.0.0.1:1 -e LOG_LEVEL=silent "$API_NEST_IMAGE")"
trap 'docker rm --force "$containerId" >/dev/null' EXIT
ready=false
for attempt in {1..30}; do
  if docker exec "$containerId" node -e "fetch('http://127.0.0.1:4000/health').then(async r => { const b = await r.json(); process.exit(r.status === 200 && b.ok === true && b.service === 'tiemLenApi' ? 0 : 1); }).catch(() => process.exit(1))"; then
    ready=true
    break
  fi
  sleep 1
done
if [[ "$ready" != true ]]; then
  docker logs "$containerId"
  exit 1
fi
docker exec "$containerId" node -e "fetch('http://127.0.0.1:4000/api/v1/admin/orders').then(r => process.exit(r.status === 401 ? 0 : 1)).catch(() => process.exit(1))"
docker exec "$containerId" node -e "const fs = require('node:fs'), assert = require('node:assert/strict'); for (const name of ['prisma', '@prisma/config', '@prisma/dev', 'deepmerge-ts', 'mysql2', 'find-my-way', 'valibot', 'typescript']) assert.equal(fs.existsSync('/app/node_modules/' + name), false, name); assert.equal(require('@prisma/client/package.json').version, '7.9.0')"
docker stop --time 30 "$containerId" >/dev/null
exitCode="$(docker inspect --format '{{.State.ExitCode}}' "$containerId")"
[[ "$exitCode" == 0 || "$exitCode" == 143 ]]
