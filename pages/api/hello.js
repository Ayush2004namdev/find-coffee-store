// Next.js API route support: https://nextjs.org/docs/api-routes/introduction

export default function handler(req, res) {
  const name = req.query.name
  res.status(200).send(name)
}
