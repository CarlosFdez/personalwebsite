@echo off
setlocal EnableExtensions DisableDelayedExpansion

if not exist _mongodata\personalwebsite (
    mkdir _mongodata\personalwebsite
)

start yarn run build-dev
start mongod --dbpath _mongodata/personalwebsite