# config valid only for current version of Capistrano
lock "3.7.2"

# Drives the source and destination server. 
# These won't work without the proper SSH key.
set :application, "personalwebsite"
set :repo_url, "git@github.com:CarlosFdez/personalwebsite.git"
server "supetroupe.com", user: "carlos"

# Deployment directory is controlled by the stages directory

# Default value for keep_releases is 5
set :keep_releases, 5

# WARNING: Build is having some problems in production so currently is disabled.
# Build fails the first time and succeeds the second time usually.
# Perhaps switching to yarn would fix it, or using something other than node-sass?
# Errors seem to be related to node-sass
# after "deploy", "build"

# Default value for :pty is false. This is enabled to run the shell in interactive mode.
# Currently its not used but I leave it here so I'm aware of it.
# set :pty, true

# Linked files and directories are pulled from your system instead of github
# If we ever get local only config files, define them below
# append :linked_files, "config/database.yml", "config/secrets.yml"
# append :linked_dirs, "log", "tmp/pids", "tmp/cache", "tmp/sockets", "public/system"