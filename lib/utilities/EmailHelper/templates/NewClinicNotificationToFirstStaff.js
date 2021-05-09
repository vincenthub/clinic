module.exports = {
    subject: (v) =>  `You are now part of ${v.clinic_name} clinic!` ,
    htmlContent: (v) => {
        return `Hi <b>${v.name}</b>,<br><br>
You are now part of the ${v.clinic_name} clinic!<br><br>
You may configure the clinic when you login.<br><br>
- Admin`;
    },
    textContent: (v) => {
        return `Hi ${v.name},

You are now part of the ${v.clinic_name}!

You may configure the clinic when you login.

- Admin`;
    }
}
