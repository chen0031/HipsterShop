// import otel dependencies
const opentelemetry = require('@opentelemetry/api');
const { LogLevel } = require("@opentelemetry/core");
const { NodeTracerProvider } = require("@opentelemetry/node");
const {BatchSpanProcessor} = require("@opentelemetry/tracing");
const { JaegerExporter } = require("@opentelemetry/exporter-jaeger");
const { B3Propagator } = require("@opentelemetry/core");

module.exports = (serviceName) => {
    // set up exporter options
    const jaegerOptions = {
        serviceName: serviceName,
    }

    const provider = new NodeTracerProvider({
        logLevel: LogLevel.ERROR,
    });

    if (process.env.JAEGER_ENDPOINT !== '') {
        provider.addSpanProcessor(
            new BatchSpanProcessor(
                new JaegerExporter(jaegerOptions)
            )
        )
    }

    provider.register({
        // Use B3 Propagation
        propagator: new B3Propagator(),
    });
    return opentelemetry.trace.getTracer(serviceName);
}
