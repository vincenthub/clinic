module.exports = {
    RECORD_STATUS: { //ADMIN USED
        ACTIVE:1, 
        INACTIVE:2,
        DELETED:0 
    },
    CLINIC_SCHEDULE_STATUS: {
        CLOSE:0, 
        OPEN:1
    },
    CLINIC_SCHEDULE_REPEAT: {
        NONE:0, 
        DAILY:1, 
        WEEKLY:2, 
        MONTHLY:3
    },
    APPOINTMENT_STATUS: {
        QUEUED:1, 
        SCHEDULED:2, 
        CONFIRMED:3, 
        PRESENT:4, 
        CANCELED:5, 
        MISSED:6
    },
    SOCIAL_LOGIN: {
        FACEBOOK:1, 
        GOOGLE:2, 
        APPLE:3
    }
};
