
module.exports = function(client, index, done) {
  client.indices.delete({
    index
  }, (err) => {
    if(err && err.status === 404) return done()
    done(err)
  })
}
