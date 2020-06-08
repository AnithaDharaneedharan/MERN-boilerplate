const User = require("../../models/User");
const UserSession = require("../../models/UserSession");

module.exports = app => {

  app.post("/api/account/signup", (req, res, next) => {
    const { body } = req;
    const { firstName, lastName, password } = body;
    let { email } = body;

    if (!firstName) {
      console.log(firstName)
      return res.send({
        success: false,
        message: "Error: First name cannot be blank"
      });
    }
    if (!lastName) {
      return res.send({
        success: false,
        message: "Error: Last name cannot be blank"
      });
    }
    if (!email) {
      return res.send({
        success: false,
        message: "Error: Email name cannot be blank"
      });
    }
    if (!password) {
      return res.send({
        success: false,
        message: "Error: Password name cannot be blank"
      });
    }

    console.log("user");
    email = email.toLowerCase();
    //1.verify email doesnt exist
    //2. save
    User.find({ email: email.toLowerCase() }, (err, previousUsers) => {
      console.log(previousUsers);
      if (err) {
        return res.send({ success: false, message: "Error: Server error" });
      } else if (previousUsers.length > 0) {
        return res.send({
          success: false,
          message: "User account already exists"
        });
      }

      const newUser = new User();
      newUser.email = email;
      newUser.firstName = firstName;
      newUser.lastName = lastName;
      newUser.password = newUser.generateHash(password);
      newUser.save((err, user) => {
        if (err) {
          return res.send({ success: false, message: "Error: Server error" });
        }
        return res.send({
          success: true,
          message: `${user.firstName} ${user.lastName} Signed up`
        });
      });
    });
  });

  app.post("/api/account/signin", (req, res, next) => {
    const { body } = req;
    const { password } = body;
    let { email } = body;
    email = email.toLowerCase();

    if (!email) {
      return res.send({
        success: false,
        message: "Error: Email name cannot be blank"
      });
    }
    if (!password) {
      return res.send({
        success: false,
        message: "Error: Password name cannot be blank"
      });
    }
    User.find({ email: email }, (err, users) => {
      if (err) {
        return res.send({ success: false, message: "Error: server error" });
      }
      if (users.length != 1) {
        return res.send({ success: false, message: "Error: Invalid email" });
      }
      const user = users[0];
      if (!user.validPassword(password)) {
        return res.send({ success: false, message: "Error: Invalid password" });
      }
      // otherwise create user session
      const userSession = new UserSession();
      userSession.userId = user._id;
      userSession.save((err, doc) => {
        if (err) {
          return res.send({ success: false, message: "Error: Server error" });
        }
        return res.send({
          success: true,
          message: "Valid sign in",
          token: doc._id
        });
      });
    });
  });

  app.get("/api/account/verify", (req, res, next) => {
    // get the token
    // verify the token is one of kind and not deleted
    const { query } = req;
    const { token } = query;

    UserSession.find({ _id: token, isDeleted: false }, (err, sessions) => {
      if (err) {
        return res.send({
          success: false,
          message: "Error: Server error"
        });
      }
      if (sessions.length != 1) {
        return res.send({
          success: false,
          message: "Error: Server error"
        });
      } else {
        return res.send({
          success: true,
          message: "Good"
        });
      }
    });
  });

  app.get("/api/account/logout", (req, res, next) => {
    const { query } = req;
    const { token } = query;

    UserSession.findOneAndUpdate(
      {
        _id: token,
        isDeleted: false
      },
      {
        $set: { isDeleted: true }
      },
      null,
      (err, sessions) => {
        if (err) {
          return res.send({
            success: false,
            message: "sever error"
          });
        } else
          return res.send({
            success: true,
            message: "Good"
          });
      }
    );
  });
};
