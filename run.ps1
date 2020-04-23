docker build -t lawnmawer:latest -f "Dockerfile.dev" .
docker run \
  -it --rm \
  -v "$(pwd)/src:/app/src" \
  -v "$(pwd)/public:/app/public" \
  -p 3000:3000 lawnmawer:latest