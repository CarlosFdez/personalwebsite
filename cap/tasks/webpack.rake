namespace :webpack do
    task :build do
        desc "Runs a webpack build, populating assets/build locally"

        sh 'yarn run build'
    end

    task :upload do
        on roles(:all) do
            upload! 'assets/webpack-manifest.json', "#{release_path}/assets/"
            upload! 'assets/build/', "#{release_path}/assets/", recursive: true
        end
    end
end