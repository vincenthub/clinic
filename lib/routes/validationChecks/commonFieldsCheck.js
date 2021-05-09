const { check } = require('express-validator');

exports.addressFieldsCheck = [
    check('buildingNo',
        'INVALID_BUILDING_NUMBER')
        .isLength({ min: 1, max: 255 }),
    check('street',
        'INVALID_STREET')
        .isLength({ min: 1, max: 255 }),
    check('barangay',
        'INVALID_BARANGAY')
        .isLength({ min: 1, max: 255 }),
    check('municipality',
        'INVALID_MUNICIPALITY')
        .isLength({ min: 1, max: 255 }),
    check('city',
        'INVALID_CITY')
        .isLength({ min: 1, max: 255 }),
    check('province',
        'INVALID_PROVINCE')
        .isLength({ min: 1, max: 255 }),
    check('country',
        'INVALID_COUNTRY')
        .isLength({ min: 1, max: 255 }),
    check('countryCode',
        'INVALID_COUNTRY_CODE')
        .isLength({ min: 2, max: 2 }),
    check('postal',
        'INVALID_POSTAL_CODE')
        .isLength({ min: 4, max: 4 }),
    check('latitude',
        'INVALID_LONGITUDE_VALUE')
        .not()
        .isEmpty()
        .bail()
        .isNumeric(),
    check('longitude',
        'INVALID_LATITUDE_VALUE')
        .not()
        .isEmpty()
        .bail()
        .isNumeric(),
];
