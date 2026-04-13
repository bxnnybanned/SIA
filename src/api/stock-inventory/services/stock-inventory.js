'use strict';

/**
 * stock-inventory service
 */

const { createCoreService } = require('@strapi/strapi').factories;

module.exports = createCoreService('api::stock-inventory.stock-inventory');
