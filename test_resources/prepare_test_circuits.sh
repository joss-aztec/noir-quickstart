#! /bin/bash

cd "$(dirname "$0")"
test_resources_dir=$(pwd)

# TODO: It probably makes sense to reimplement this process with the wasm
# build of noir.

# TODO: The version should be probably be inferred from dependecies
TARGET_NARGO_VER="0.3.0"

# Assumes noirup is installed
# TODO: skip if already has correct version
noirup --version $TARGET_NARGO_VER

cd $test_resources_dir/circuit1
nargo compile circuit1
cd $test_resources_dir/circuit2
nargo compile circuit2
