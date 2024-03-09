from `.register(this.adapter.registerPlugin(), { prefix: this.options.route });`
to `.register(this.adapter.registerPlugin(), {prefix: `${ globalPrefix }${ this.options.route }`});`
