docker build -t lawnmawer:latest -f "Dockerfile.dev" .
docker run -it --rm -v "$(pwd):/app" -p 3000:3000 lawnmawer:latest