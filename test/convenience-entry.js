var git = require('../');

var sha = '5716e9757886eaf38d51c86b192258c960d9cfea';

var getEntry = function(path, callback) {
  git.repo.open('../.git', function(error, repo) {
    repo.commit(sha, function(error, commit) {
      commit.file(path, function(error, entry) {
        callback(error, entry);
      });
    });
 });
};

exports.missingFile = function(test) {
  test.expect(1);

  getEntry('test/convenience-entry.js', function(error, entry) {
    test.notEqual(error, null, 'Missing file should error');
    test.done();
  });
};

exports.sha = function(test) {
  test.expect(1);
  getEntry('README.md', function(error, entry) {
    var sha = entry.sha();
    test.equal(sha, '6cb45ba5d32532bf0d1310dc31ca4f20f59964bc', 'Entry SHA should match expected value');
    test.done();
  });
};

exports.isFile = function(test) {
  test.expect(2);
  getEntry('README.md', function(error, entry) {
    var isFile = entry.isFile();
    test.equal(isFile, true, 'Entry is a file');
    getEntry('example', function(error, entry) {
      var isFile = entry.isFile();
      test.equal(isFile, false, 'Entry is a directory');
      test.done();
    });
  });
};

exports.isDirectory = function(test) {
  test.expect(2);
  getEntry('example', function(error, entry) {
    var isFile = entry.isFile();
    test.equal(isFile, false, 'Entry is a directory');
    getEntry('README.md', function(error, entry) {
      var isFile = entry.isFile()
      test.equal(isFile, true, 'Entry is a file');
      test.done();
    });
  });
};

exports.name = function(test) {
  test.expect(2);
  getEntry('test/raw-commit.js', function(error, entry) {
    test.equal(error, null, 'Should not error');
    var name = entry.name();
    test.equal(name, 'raw-commit.js', 'Name should match expected value');
    test.done();
  });
};

exports.getBlob = function(test) {
  test.expect(1);
  getEntry('test/raw-commit.js', function(error, entry) {
    entry.getBlob(function(error, blob) {
      test.equal(blob.size(), 2736, 'Content length should match expected value');
      test.done();
    });
  });
};

exports.getTree = function(test) {
  test.expect(1);
  getEntry('test', function(error, entry) {
    entry.getTree(function(error, tree) {
      test.equal(tree instanceof git.tree, true, 'Expected instance of Tree');
      test.done();
    });
  });
};
