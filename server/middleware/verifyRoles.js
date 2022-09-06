const verifyRoles = (...allowedRoles) => {
  return (req, res, next) => {
    console.log("ROLES RECEIVED FROM USER: " + req.roles);
    if (!req?.roles) return res.sendStatus(401);
    const rolesArray = [...allowedRoles];
    const userRole = req.roles;
    console.log("allowed roles: " + rolesArray);
    const result = allowedRoles.find((role) => role === userRole);
    console.log(result);
    if (!result) return res.sendStatus(401);
    next();
  };
};

module.exports = verifyRoles;
