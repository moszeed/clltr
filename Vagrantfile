# -*- mode: ruby -*-
# vi: set ft=ruby :

#original: https://gist.github.com/lmakarov/54302df8ecfc87b36320
$install_docker_compose = <<EOF

    DOCKER_COMPOSE_VERSION=1.6.2

    # Download docker-compose to the permanent storage
    echo 'Downloading docker-compose to the permanent VM storage...'
    sudo mkdir -p /var/lib/boot2docker/bin
    sudo curl -sL https://github.com/docker/compose/releases/download/${DOCKER_COMPOSE_VERSION}/docker-compose-`uname -s`-`uname -m` -o /var/lib/boot2docker/bin/docker-compose
    sudo chmod +x /var/lib/boot2docker/bin/docker-compose
    sudo ln -sf /var/lib/boot2docker/bin/docker-compose /usr/local/bin/docker-compose

    # Making the symlink persistent via bootlocal.sh
    echo 'Writing to bootlocal.sh to make docker-compose available on every boot...'
    cat <<SCRIPT | sudo tee -a /var/lib/boot2docker/bootlocal.sh > /dev/null
        # docker-compose
        sudo ln -sf /var/lib/boot2docker/bin/docker-compose /usr/local/bin/docker-compose
    SCRIPT

    sudo chmod +x /var/lib/boot2docker/bootlocal.sh
EOF

$build_project = <<EOF

    echo "Build Project";

    cd /clltr
    docker-compose build --no-cache
EOF

$run_docker_compose = <<EOF

    echo "wait 10 seconds"
    sleep 10

    # remove all untagged/dangling/none images
    DOCKER_DANGLING_IMAGES=$(docker images -q -f dangling=true)
    if [ -n "$DOCKER_DANGLING_IMAGES" ]; then
        docker rmi -f $DOCKER_DANGLING_IMAGES
    fi

    # show used docker & nodejs version
    echo "\n"
    echo "------------------------------------------"
    docker --version
    echo "------------------------------------------"
    echo "Node.js version"
    docker run clltr_webdev node -v
    echo "------------------------------------------"
    echo "NPM version"
    docker run clltr_webdev npm -v
    echo "------------------------------------------"
    echo "NPM outdated (global)"
    docker run clltr_webdev npm outdated -g
    echo "------------------------------------------"
    echo "NPM outdated (project)"
    docker run clltr_webdev npm outdated
    echo "------------------------------------------"

    echo "\n"
    cd /clltr
    docker-compose up -d
EOF

#
# vagrant configuration
#
Vagrant.configure(2) do |config|

    config.vm.box = "moszeed/boot2docker"

    #config for app
    config.vm.define :clltr do |clltr|

        #network
        clltr.vm.network "forwarded_port", guest: 8282, host: 8282, auto_correct: true
        clltr.vm.network "forwarded_port", guest: 9000, host: 9000, auto_correct: true
        clltr.vm.network "public_network"

        #shared folders
        clltr.vm.synced_folder ".", "/clltr"
        clltr.vm.synced_folder ".", "/vagrant", disabled: true

        #scripts
        clltr.vm.provision :shell, inline: $install_docker_compose
        clltr.vm.provision :shell, inline: $build_project
        clltr.vm.provision :shell, inline: $run_docker_compose, run: "always", :privileged => false

    end

    #set name for vm
    config.vm.provider "virtualbox" do |v|
        v.name = "clltr"
        v.customize ["modifyvm", :id, "--memory", "1024"]
        v.customize ["sharedfolder", "add", :id, "--name", "www", "--hostpath", (("//?/" + File.dirname(__FILE__) + "/www").gsub("/","\\"))]
        v.customize ["setextradata", :id, "VBoxInternal2/SharedFoldersEnableSymlinksCreate/v-root", "1"]
    end

end
