"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const ua_parser_js_1 = require("ua-parser-js"); // Correct named import
// const deviceTypePlugin: FastifyPluginAsync = async (fastify) => {
//   fastify.addHook('onRequest', async (request, reply) => {
//     try {
//       const userAgent = request.headers['user-agent'] || '';
//       // Correct instantiation
//       const parser = new UAParser(userAgent);
//       const result = parser.getResult();
//       // Enhanced device type detection with fallbacks
//       const deviceType = result.device?.type || 
//                         (result.os?.name?.toLowerCase().includes('android') ? 'mobile' : 
//                         (result.os?.name?.toLowerCase().includes('ios') ? 'mobile' : 'desktop'));
//       // Attach to request object (better than headers)
//       request.deviceType = deviceType;
//       // Optional: Also set as header if needed
//       request.headers['x-device-type'] = deviceType;
//     } catch (error) {
//       fastify.log.error(`Device detection error: ${error}`);
//       request.deviceType = 'unknown';
//     }
//   });
// };
const deviceTypePlugin = async (fastify) => {
    fastify.addHook('onRequest', async (request, reply) => {
        try {
            const userAgent = request.headers['user-agent'] || '';
            const parser = new ua_parser_js_1.UAParser(userAgent);
            const result = parser.getResult();
            let deviceType = 'desktop'; // default
            if (result.device?.type) {
                deviceType = result.device.type;
            }
            else if (userAgent.match(/mobile|android|iphone|ipad|ipod/i)) {
                deviceType = 'mobile';
            }
            else if (userAgent.match(/tablet|ipad/i)) {
                deviceType = 'tablet';
            }
            // Normalize device type to match your enum
            if (!['mobile', 'tablet', 'desktop'].includes(deviceType)) {
                deviceType = 'other';
            }
            request.deviceType = deviceType;
            request.headers['x-device-type'] = deviceType;
        }
        catch (error) {
            fastify.log.error(`Device detection error: ${error}`);
            request.deviceType = 'unknown';
        }
    });
};
exports.default = deviceTypePlugin;
//# sourceMappingURL=plugins.js.map