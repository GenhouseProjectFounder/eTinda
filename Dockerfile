# Use the official Ubuntu image as base
FROM ubuntu:latest

# Install required dependencies
RUN apt-get update && \
    apt-get install -y curl unzip git ca-certificates && \
    apt-get clean

# Set environment variable to suppress interactive prompts
ENV DEBIAN_FRONTEND=noninteractive

# Install Bun
RUN curl -fsSL https://bun.sh/install | bash

# Add Bun to PATH
ENV PATH="/root/.bun/bin:$PATH"

# Set working directory
WORKDIR /app

# Copy current project files into container
COPY . .

# Install project dependencies using Bun
RUN bun install

# Default command
CMD ["bun", "run", "dev"]


