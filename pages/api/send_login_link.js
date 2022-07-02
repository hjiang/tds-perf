export default function handler(req, res) {
  console.log(req.body.email);
  res.status(200).json({});
}
