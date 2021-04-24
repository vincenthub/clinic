module.exports = {
    subject: (v) =>  `Staff account access for ${v.email}` ,
    htmlContent: (v) => {
        return `Hi <b>${v.name}</b>,<br>
<br>
Your email login: <b>${v.email}</b><br>
Your temporary password: <b>${v.password}</b><br>
<br>
Your temporary password will expire in 12 hours.<br>
<br>
- Admin`;
    },
    textContent: (v) => {
        return `Hi ${v.name},
    
Your email login: ${v.email}
Your temporary password: ${v.password}

Your temporary password will expire in 12 hours.

- Admin`;
    }
}
