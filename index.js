const nodegit = require("nodegit");
nodegit.Repository.open("../Onu/onu2-server")
    .then(function (repo) {
        // Get the master branch
        return repo.getMasterCommit();
    })
    .then(function (firstCommitOnMaster) {
        // Create a new history event emitter
        const history = firstCommitOnMaster.history();

        // Listen for commits on the event emitter
        history.on("commit", function (commit) {
            console.log(commit.sha());
            console.log(commit.message());
            console.log(
                commit.author().name() + " <" + commit.author().email() + ">"
            );
        });

        // Start emitting events
        history.start();

    })
    .catch(function (err) {
        console.log(err);
    });
