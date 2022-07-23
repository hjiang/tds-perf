import uuid from 'short-uuid';
import sha224 from 'sha224';
import LC from 'leanengine';

const VerificationLink = LC.Object.extend('VerificationLink');

export function isSessionUserValid(user) {
  return user && user.username && user.email && user.id;
}

export function sessionUser(session) {
  if (isSessionUserValid(session.user)) {
    return session.user;
  } else {
    if (session.user) {
      console.error(`invalid session user: ${session.user}`);
    }
    session.destroy();
    return null;
  }
}

function genToken(str) {
  return sha224(uuid.generate() + str + process.env.COOKIE_KEY).toString('hex');
}

export function createVerificationToken(email) {
  const token = genToken(email);
  const link = new VerificationLink({ email, token });
  return new Promise((resolve, reject) => {
    link
      .save()
      .then(() => {
        resolve(token);
      })
      .catch(reject);
  });
}

export async function findOrCreateUserByEmail(email) {
  const query = new LC.Query(LC.User);
  query.equalTo('email', email);
  let user = await query.first({ useMasterKey: true });
  if (user) {
    return user;
  } else {
    const username = email.split('@')[0];
    user = new LC.User({
      email,
      username,
      password: genToken(),
    });
    return await user.save();
  }
}

export async function findUsersByManager(managerId) {
  const manager = LC.Object.createWithoutData('_User', managerId);
  const query = new LC.Query(LC.User);
  query.equalTo('manager', manager);
  query.limit(1000);
  const users = await query.find({ useMasterKey: true });
  return users.map((u) => {
    const { objectId, email, username } = u.toJSON();
    return { objectId, email, username };
  });
}

// TODO refactor the following and use findOrCreateUserByEmail()
//
// Find the user corresponding to the login token, create a new user if the
// token is valid but the user doesn't exist yet. The token is deleted.
export function getUserFromToken(token) {
  const query = new LC.Query(VerificationLink);
  query.equalTo('token', token);
  return new Promise((resolve, reject) => {
    query
      .first()
      .then((link) => {
        if (!link) {
          resolve(null);
        } else {
          const email = link.get('email');
          return link.destroy().then(() => {
            const query = new LC.Query(LC.User);
            query.equalTo('email', email);
            return query.first({ useMasterKey: true }).then((user) => {
              if (user) {
                resolve({
                  email: user.getEmail(),
                  username: user.getUsername(),
                  id: user.getObjectId(),
                });
              } else {
                const username = email.split('@')[0];
                const user = new LC.User({
                  email,
                  username,
                  password: genToken(),
                });
                return user
                  .save()
                  .then((user) =>
                    resolve({ email, username, id: user.getObjectId() }),
                  );
              }
            });
          });
        }
      })
      .catch(reject);
  });
}

export async function userHasRole(userId, roleName) {
  const user = LC.Object.createWithoutData('_User', userId);
  const roles = await user.getRoles();
  return roles.filter((r) => r.getName() === roleName).length > 0;
}
