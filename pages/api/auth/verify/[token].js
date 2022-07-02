import {getUserFromToken} from '../../../../lib/user';
import {withSessionRoute} from '../../../../lib/session';

function handler(req, res) {
  const token = req.query.token;
  return getUserFromToken(token).then(user => {
    if (user) {
      req.session.user = user;
      return req.session.save().then(() => {
        res.redirect('/');
      })
    } else {
      res.send('Invalid token. Please try signing in again');
    }
  })
}

export default withSessionRoute(handler);
