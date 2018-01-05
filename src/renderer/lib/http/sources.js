export default class HttpSources {

  static sources = []

  static add(source: Object) {
    this.sources[source.token] = source.cancel
  }

  static remove(source: Object) {
    delete this.sources[source.token]
  }

  static cancelAll(message: String = 'Route change') {
    Object.values(this.sources).forEach(cancel => cancel(message))
  }

}
