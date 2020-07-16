using Microsoft.Extensions.Logging;
using Jaeger;
using Jaeger.Samplers;
namespace gRPC.Message
{
    public static class TracingHelper
    {
        public static Tracer InitTracer(string serviceName, ILoggerFactory loggerFactory)
        {
            Configuration.SamplerConfiguration samplerConfiguration = new Configuration.SamplerConfiguration(loggerFactory)
                .WithType(ConstSampler.Type)
                .WithParam(1);
            Configuration.ReporterConfiguration reporterConfiguration = new Configuration.ReporterConfiguration(loggerFactory)
                .WithLogSpans(true);
            return (Tracer)new Configuration(serviceName, loggerFactory)
                .WithSampler(samplerConfiguration)
                .WithReporter(reporterConfiguration)
                .GetTracer();
        }
    }
}
