# These are standard rake tasks and 

task :build => ['build:install', 'build:portfolio']

namespace :build do
    task :install do
        desc "Runs npm install to setup and update dependencies"
        on roles :all do
            within release_path do
                execute :yarn, '--production', '--silent', '--no-progress'
            end
        end
    end

    task :portfolio do
        desc "Builds and symlinks the production portfolio folder"
        on roles :all do
            within release_path do
                # For now we symlink production -> development and use that one
                # later on we will link to a separate repository for portfolio data
                execute "ln", "-sf", "development", "portfolio_data/production"

                execute :yarn, :run, :portfolio, :production
            end
        end
    end
end