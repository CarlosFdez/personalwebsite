# config valid only for current version of Capistrano
lock "3.7.2"

set :application, "personalwebsite"
set :repo_url, "git@github.com:CarlosFdez/personalwebsite.git"

server "supetroupe.com", user: "carlos"

# Default deploy_to directory is /var/www/my_app_name

# Default value for keep_releases is 5
set :keep_releases, 5

# Default value for :pty is false
# set :pty, true

# Default value for :linked_files is []
# append :linked_files, "config/database.yml", "config/secrets.yml"

# Default value for linked_dirs is []
# append :linked_dirs, "log", "tmp/pids", "tmp/cache", "tmp/sockets", "public/system"

# Default value for default_env is {}
# set :default_env, { path: "/opt/ruby/bin:$PATH" }

task :build do
    on roles :all do
        execute "npm install"
        execute "npm run build"
    end
end