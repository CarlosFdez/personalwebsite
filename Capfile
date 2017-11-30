# Move from default locations
# idea from http://capistranorb.com/documentation/faq/how-can-i-set-capistrano-configuration-paths/
set :deploy_config_path, 'cap/deploy.rb'
set :stage_config_path, 'cap/stages'

# Load DSL and set up stages
require "capistrano/setup"

# Include default deployment tasks
require "capistrano/deploy"

# Load the SCM plugin appropriate to your project:
require "capistrano/scm/git"
install_plugin Capistrano::SCM::Git

# Load custom tasks from `cap/tasks`
Dir.glob("cap/tasks/*.rake").each { |r| import r }
