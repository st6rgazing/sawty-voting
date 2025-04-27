const express = require("express")
const crypto = require("crypto")
const nodemailer = require("nodemailer")
const cors = require("cors")
const fs = require("fs")
const path = require("path")

console.log("✅ All modules loaded")

const app = express()
const port = process.env.PORT || 3000

// --- MIDDLEWARE ---
console.log("⌛ Setting up Express middleware...")
app.use(cors())
app.use(express.json())
// Serve static files from public directory
app.use(express.static(path.join(__dirname, "public")))
console.log("✅ Express middleware setup complete")

// --- CONFIG ---
const frontendBaseURL = process.env.FRONTEND_URL || "https://sawty-voting.vercel.app"
const encryptionKey = process.env.ENCRYPTION_KEY || "12345678901234567890123456789012" // 32 characters
const iv = Buffer.alloc(16, 0) // 16 bytes all zeros IV

const mailingList = process.env.MAILING_LIST
  ? process.env.MAILING_LIST.split(",")
  : [
    "amro.imam@outlook.com",
    "thaisdelimasilva@gmail.com",
    "alldavidcony@gmail.com",
    "argyros@csd.uoc.gr",
    "davide.fanciulli@un.org",
    "hei@zurich.ibm.com",
    "kelmaghr@us.ibm.com",
    "hsati@nyu.edu",
    "vardaan.sahgal@womanium.org",
    "terri.burns@nyu.edu",
    "reem@womeninai.co",
    "worawat@g.sut.ac.th",
    "pakshenchoong@gmail.com",
    "krisztian.benyo@enpc.fr",
    "edoardo.pedicillo@gmail.com",
    "joanna.e.majsak@gmail.com",
    "kramadi@nyu.edu",
    "muhammad.shafique@nyu.edu",
    "baghdadi@nyu.edu",
    "Youssef.Eldakar@bibalex.org",
    "gff@co.it.pt",
    "juliatt@amazon.de",
    "lgatti@correo.um.edu.uy",
    "mkhurana1_be22@thapar.edu",
    "amaria.javed@nyu.edu",
    "201137@ppu.edu.ps",
    "begali.aslonov@studenti.polito.it",
    "lzahhafi@aims.ac.rw",
    "achditya@gmail.com",
    "Omid.Hassasfar@gmail.com",
    "wenhe.zhang@yale.edu",
    "momahmoud591@gmail.com",
    "mennamagdyx@gmail.com",
    "ssingh27_be22@thapar.edu",
    "sh7072@nyu.edu",
    "m.batale@alustudent.com",
    "yz9687@nyu.edu",
    "natansh.mathur@qcware.com",
    "217034@ppu.edu.ps",
    "hope.alemayehu-ug@aau.edu.et",
    "mohamed.hamaidi@ensia.edu.dz",
    "nnm30@mail.aub.edu",
    "david.morcuende.c@gmail.com",
    "ehll@g.clemson.edu",
    "patriciankenlif@gmail.com",
    "nunomarquesbatista@gmail.com",
    "b00091104@aus.edu",
    "ab10028@nyu.edu",
    "hj2342@nyu.edu",
    "malmetnawy@gmail.com",
    "jy_farhani@esi.dz",
    "premsing212@jbnu.ac.kr",
    "zaynassaf2001@gmail.com",
    "tusharp@tamu.edu",
    "valentm@clemson.edu",
    "b00098231@aus.edu",
    "okekemakuo67@gmail.com",
    "douaa.salah@epfl.ch",
    "fenlei.chen@yale.edu",
    "100060746@ku.ac.ae",
    "smaffan21@gmail.com",
    "chantelle@aims.edu.gh",
    "af4329@nyu.edu",
    "ben.hall@infleqtion.com",
    "belal.asad@students.alquds.edu",
    "nouhaila.innan@nyu.edu",
    "GehadSalemFekry@aucegypt.edu",
    "shhun75@gmail.com",
    "mxf4642@nyu.edu",
    "ekimfrankey@gmail.com",
    "kiryowa@aims.edu.gh",
    "dyn0215296@ju.edu.jo",
    "U22100221@sharjah.ac.ae",
    "b00089025@aus.edu",
    "221116@ppu.edu.ps",
    "ZIYATIHAFSSA14@GMAIL.COM",
    "g00091123@aus.edu",
    "belekarg@tcd.ie",
    "kristina.d.kirova@gmail.com",
    "oturki036@gmail.com",
    "jamesamyer@gmail.com",
    "mousa_math@ppu.edu",
    "an3502@nyu.edu",
    "malicksalman2@gmail.com",
    "U22100183@sharjah.ac.ae",
    "rimst3@gmail.com",
    "tt2273@nyu.edu",
    "kk4827@nyu.edu",
    "ay2395@nyu.edu",
    "saraalagami@gmail.com",
    "pawel.gora@qaif.org",
    "sakibul56@gmail.com",
    "adh323@lehigh.edu",
    "espinosa.s@northeastern.edu",
    "adk05@mail.aub.edu",
    "jam37@mail.aub.edu",
    "deahmedbacha@gmail.com",
    "km_bekkar@esi.dz",
    "safaebouziani27@gmail.com",
    "mis9424@nyu.edu",
    "aaa9988@nyu.edu",
    "ni2071@nyu.edu",
    "nils.quetschlich@tum.de",
    "epadouros@gmail.com",
    "epelaez@uchicago.edu",
    "100067138@ku.ac.ae",
    "yonara.anastacio@columbia.edu",
    "y.kouttane@aui.ma",
    "m_abualrub03@outlook.com",
    "202110225@students.asu.edu.jo",
    "omarsufyan2016@gmail.com",
    "km_benbetka@esi.dz",
    "akanbari@student.42abudhabi.ae",
    "mki4895@nyu.edu",
    "maryam.alsabaaa@gmail.com",
    "jibranrashid@gmail.com",
    "sjayaraj@nyit.edu",
    "cffuidio@gmail.com",
    "squan710@gmail.com",
    "zakaria.boutakka-etu@etu.univh2c.ma",
    "ka_seddiki@esi.dz",
    "lk_brouthen@esi.dz",
    "g00095118@aus.edu",
    "tcivini@gmail.com",
    "hajarasabnam@gmail.com",
    "Tamara.hamad01@gmail.com",
    "andrei.bornea@insead.edu",
    "alisaffarini@college.harvard.edu",
    "luca.sipoteanu@nyu.edu",
    "as15471@nyu.edu",
    "as.aminesouiri@gmail.com",
    "bhernandez2318@gmail.com",
    "joaquin.molina.u@uc.cl",
    "oliver.knitter@sandboxquantum.com",
    "staha@tcd.ie",
    "nguyenhoanganh20033@gmail.com",
    "yassine.berrada2020@gmail.com",
    "am12805@nyu.edu",
    "myn11@mail.aub.edu",
    "farhan.kamrul@nyu.edu",
    "km_arab@esi.dz",
    "pawuah@aims.edu.gh",
    "aniruddhasen@utexas.edu",
    "najones@clemson.edu",
    "alberto.marchisio@nyu.eu",
    "kooshan.mk@gmail.com",
    "Is2431@nyu.edu",
    "priya.aswani28139@gmail.com",
    "noah.ripke@yale.edu",
    "tfg7297@nyu.edu",
    "ireneamedji@gmail.com",
    "dv2335@nyu.edu",
    "mostafatorkashvand98@yahoo.com",
    "hala.renann@gmail.com",
    "kambleyash679@gmail.com",
    "nadaelhaj@hotmail.com",
    "mohammed.alghadeer@physics.ox.ac.uk",
    "erenaykrcn@hotmail.com",
    "anguetsa@aimsric.org",
    "muhammadkashif038@gmail.com",
    "U22106802@sharjah.ac.ae",
    "omarkashour45@gmail.com",
    "rt2970@columbia.edu",
    "h.awladmohammed@student.aaup.edu",
    "a23ibrah@uwaterloo.ca",
    "db4364@nyu.edu",
    "mahdia.toubal@gmail.com",
    "k.jallad.l@gmail.com",
    "naa506@nyu.edu",
    "sc9425@nyu.edu",
    "samakanbour@gmail.com",
    "azizaalm@mit.edu",
    "sjv2896@nyu.edu",
    "Awadhoot-Vijay_Loharkar@etu.u-bourgogne.fr",
    "asawaika@yahoo.com",
    "arnisjl7@gmail.com",
    "23u236@psgtech.ac.in",
    "aqsask2004@gmail.com",
    "lwa2019@nyu.edu",
    "oduaiabrb@gmail.com",
    "mka7870@nyu.edu",
    "100061269@ku.ac.ae",
    "khaled.w.alshaer@gmail.com",
    "parampathak28@gmail.com",
    "elmaouaki.walid@gmail.com",
    "rumlah.amer@gmail.com",
    "zakaria.dahbi@kcl.ac.uk",
    "konstantinosdalampekis@gmail.com",
    "ys3571@columbia.edu",
    "shoogshun.19@gmail.com",
    "qassamwirdian3@gmail.com",
    "rmb9836@nyu.edu",
    "ak11796@nyu.edu",
    "100063481@ku.ac.ae",
    "ajs787@scarletmail.rutgers.edu",
    "mk8737@nyu.edu",
    "mnaghdi@caltech.edu",
    "thakur.akashkant@gmail.com",
    "amahdy7@gmail.com",
    "up202200549@edu.fe.up.pt",
    "mariamimahomed@gmail.com",
    "g12_gonzalez@ens.cnyn.unam.mx",
    "la_akeb@esi.dz",
    "jf_rezkellah@esi.dz",
    "dev.aswani1505@gmail.com",
    "javi@karibalabs.co",
    "othman.omm@najah.edu",
    "g00091827@aus.edu",
    "visistajayanti@gmail.com",
    "yaffajaradat@gmail.com",
    "claudiogomes@cmu.edu",
    "muhammadalzafark@gmail.com",
    "aulan@aims.ac.za",
    "oisamade999@gmail.com",
    "d.waweru@alustudent.com",
    "tasnim.ahmed@nyu.edu",
    "pablobastante550@gmail.com",
    "talah.2204@gmail.com",
    "nathan.abebe@yale.edu",
    "mom8702@nyu.edu",
    "s12255133@stu.najah.edu",
    "jccga@iscte-iul.pt",
    "ma7030@nyu.edu",
    "aws.alhantouli@gmail.com",
    "colin.campbell@infleqtion.com",
    "forsomethingnewsid@gmail.com",
    "nada.ik81@gmail.com",
    "soguntunnbi@gmail.com",
    "martin.moureau@epfl.ch",
    "william.zhong@yale.edu",
    "hounsavijuleskoffi@gmail.com",
    "s12116231@stu.najah.com",
    "miqdadyayah0@gmail.com",
    "arg9555@nyu.edu",
    "rebecca.rajeshb@gmail.com",
    "ns5376@nyu.edu",
    "evameguem@gmail.com",
    "14akash2000@gmail.com",
    "ruddin@iba.edu.pk",
    "souhaibbenbouazza@gmail.com",
    "kaa74@mail.aub.edu",
    "yash.chauhan@niser.ac.in",
    "nesrine.abdelhak@ensia.edu.dz",
    "shamzaou@student.42abudhabi.ae",
    "mariomamdouh@aucegypt.edu",
    "eh3115@nyu.edu",
    "msu227@nyu.edu",
    "sadeil.yassen@students.alquds.edu",
    "rm6173@nyu.edu",
    "kh_benouaklil@esi.dz",
    "ytheod@mail.ntua.gr"
  ]

const issuedSecrets = {} // { secretId: email }
let votes = [] // fallback if MongoDB fails

const votesFile = path.join(__dirname, "votes.json")
if (fs.existsSync(votesFile)) {
  try {
    votes = JSON.parse(fs.readFileSync(votesFile))
  } catch (err) {
    console.error("❌ Error reading votes file:", err)
    // Create an empty votes file if it doesn't exist or is corrupted
    fs.writeFileSync(votesFile, JSON.stringify([]))
  }
}

// --- DB CONNECTION ---
// --- Email Transporter ---
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER || "mariamshafey3@gmail.com",
    pass: process.env.EMAIL_PASS || "siffmirrcuqtvaeg", // app password
  },
})

// --- ENCRYPTION FUNCTIONS ---
function encrypt(text) {
  const cipher = crypto.createCipheriv("aes-256-cbc", Buffer.from(encryptionKey), iv)
  let encrypted = cipher.update(text, "utf8", "hex")
  encrypted += cipher.final("hex")
  return encrypted
}

function decrypt(text) {
  const decipher = crypto.createDecipheriv("aes-256-cbc", Buffer.from(encryptionKey), iv)
  let decrypted = decipher.update(text, "hex", "utf8")
  decrypted += decipher.final("utf8")
  return decrypted
}

// --- HELPER ---
function findSecretIdByEmail(email) {
  for (const [secretId, mappedEmail] of Object.entries(issuedSecrets)) {
    if (mappedEmail === email) {
      return secretId
    }
  }
  return null
}

// --- ROUTES ---

// ✅ Generate and Email Secret Links for All
app.post("/api/generate-for-all", async (req, res) => {
  const results = []

  for (const email of mailingList) {
    let secretId = findSecretIdByEmail(email)

    if (!secretId) {
      secretId = crypto.randomBytes(4).toString("hex")
      issuedSecrets[secretId] = email
    }

    const encryptedSecretId = encrypt(secretId)
    const loginLink = `${frontendBaseURL}/index?token=${encodeURIComponent(encryptedSecretId)}`

    const mailOptions = {
      from: `"Sawty Voting" <${process.env.EMAIL_USER || "mariamshafey3@gmail.com"}>`,
      to: email,
      subject: "Your Sawty Voting Link",
      text: `Hello,


Your Private ID is ${secretId}.

Please click the link below to log in automatically and cast your secure vote:

${loginLink}

This link is encrypted for your privacy.
Please do not share it with anyone.

Thank you,
Sawty Team
`,
    }

    try {
      await transporter.sendMail(mailOptions)
      console.log(`✅ Secure Voting Link sent to ${email}`)
      results.push({ email, secretId, status: "success" })
    } catch (error) {
      console.error(`❌ Failed to send to ${email}`, error)
      results.push({ email, status: "failed", error: error.message })
    }
  }

  res.json({ message: "Done sending secure links to mailing list", results })
})

// ✅ Generate Secret for One Person
app.post("/api/generate-secret", async (req, res) => {
  const { email } = req.body
  if (!email) return res.status(400).json({ message: "Email is required." })

  let secretId = findSecretIdByEmail(email)

  if (!secretId) {
    secretId = crypto.randomBytes(4).toString("hex")
    issuedSecrets[secretId] = email
  }

  const encryptedSecretId = encrypt(secretId)
  const loginLink = `${frontendBaseURL}/index?token=${encodeURIComponent(encryptedSecretId)}`

  const mailOptions = {
    from: `"Sawty Voting" <${process.env.EMAIL_USER || "mariamshafey3@gmail.com"}>`,
    to: email,
    subject: "Your Sawty Voting Link",
    text: `Hello,


Your Private ID is ${secretId}.

Please click the link below to log in automatically and cast your secure vote:

${loginLink}

This link is encrypted for your privacy.
Please do not share it with anyone.

Thank you,
Sawty Team
`,
  }
  try {
    await transporter.sendMail(mailOptions)
    console.log(`✅ Secure Voting Link sent to ${email}`)
    res.json({ message: "Secure link generated and emailed!" })
  } catch (error) {
    console.error("Error sending email:", error)
    res.status(500).json({ message: "Failed to send email.", error: error.message })
  }
})

// ✅ Submit Vote
app.post("/api/submit-vote", async (req, res) => {
  const { secretId, encryptedVote } = req.body
  if (!secretId || !encryptedVote) {
    return res.status(400).json({ message: "Private ID and vote are required." })
  }

  if (!issuedSecrets[secretId]) {
    return res.status(400).json({ message: "Invalid or expired Private ID." })
  }

  try {
    // Also save to local file as backup
    votes.push({ secretId, encryptedVote, timestamp: new Date().toISOString() })
    fs.writeFileSync(votesFile, JSON.stringify(votes, null, 2))

    delete issuedSecrets[secretId]

    console.log(`✅ Vote recorded in DB for Secret ID ${secretId}`)
    res.json({ message: "Vote submitted securely!" })
  } catch (err) {
    console.error("❌ Error saving vote to MongoDB:", err)
    // fallback save
    votes.push({ secretId, encryptedVote, timestamp: new Date().toISOString() })
    console.log({ secretId, encryptedVote, timestamp: new Date().toISOString() })
    fs.writeFileSync(votesFile, JSON.stringify(votes, null, 2))
    res.status(500).json({ message: "Saved locally due to DB error." })
  }
})

// ✅ Verify Secret
app.post("/api/verify-secret", (req, res) => {
  const { secretId } = req.body
  if (!secretId) return res.status(400).json({ valid: false, message: "Secret ID required." })

  if (issuedSecrets[secretId]) {
    return res.json({ valid: true, message: "Valid Secret ID." })
  } else {
    return res.status(400).json({ valid: false, message: "Invalid or expired Secret ID." })
  }
})

// ✅ Admin View Votes
app.get("/api/admin/votes", async (req, res) => {
  res.json(votes)
})

// ✅ Admin votes.json for Blockchain Frontend
app.get("/api/admin/votes.json", (req, res) => {
  res.sendFile(votesFile)
})

// ✅ Get Voters
app.get("/api/voters", async (req, res) => {
  try {
    const voters = await Voter.find()

    const decryptedVoters = voters.map((voter) => ({
      name: decrypt(voter.name),
      Type: decrypt(voter.Type),
      email: decrypt(voter.email),
      secretId: decrypt(voter.secretId),
    }))

    res.json(decryptedVoters)
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
})

// ✅ Get Voter by Secret ID
app.get("/api/voters/:secretId", async (req, res) => {
  const requestedSecretId = req.params.secretId

  try {
    const voters = await Voter.find() // get all voters (encrypted)

    // Decrypt secretId and find the matching voter
    const matchingVoter = voters.find((voter) => {
      const decryptedSecretId = decrypt(voter.secretId)
      return decryptedSecretId === requestedSecretIdG
    })

    if (!matchingVoter) {
      return res.status(404).json({ message: "Voter not found" })
    }

    // Decrypt full voter info
    const decryptedVoter = {
      name: decrypt(matchingVoter.name),
      Type: decrypt(matchingVoter.Type),
      email: decrypt(matchingVoter.email),
      secretId: decrypt(matchingVoter.secretId),
    }

    res.json(decryptedVoter)
  } catch (err) {
    console.error("Error:", err)
    res.status(500).json({ message: "Server error" })
  }
})

// Delete a mapping (admin function)
app.delete("/api/admin/mappings/:secretId", (req, res) => {
  const { secretId } = req.params

  if (issuedSecrets[secretId]) {
    delete issuedSecrets[secretId]
    saveSecrets() // Save to file
    res.json({ success: true, message: "Mapping deleted successfully" })
  } else {
    res.status(404).json({ success: false, message: "Mapping not found" })
  }
})

// ✅ Debug
app.get("/__debug", (req, res) => {
  res.send("✅ This is the REAL Sawty server running.")
})

// --- Start server first, then load data ---
console.log("🚀 Attempting to start server...")
app.listen(port, () => {
  // console.log(`🗳️ Sawty backend running at http://localhost:${port}`)

  console.log("📂 Loading votes file...")
  // Load votes file asynchronously after server starts
  fs.promises
    .readFile(votesFile)
    .then((data) => {
      try {
        votes = JSON.parse(data)
        console.log("✅ Votes data loaded")
      } catch (err) {
        console.error("❌ Error parsing votes file:", err)
        votes = []
        fs.writeFileSync(votesFile, JSON.stringify([]))
      }
    })
    .catch((err) => {
      if (err.code !== "ENOENT") {
        console.error("❌ Error loading votes file:", err)
      } else {
        console.log("ℹ️ No existing votes file found - starting fresh")
        // Create an empty votes file
        fs.writeFileSync(votesFile, JSON.stringify([]))
      }
    })
})

function saveSecrets() {
  // Implement the logic to save issuedSecrets to a file or database
  // This is a placeholder, replace with your actual implementation
  console.log("Saving secrets to file (placeholder)")
  fs.writeFileSync("secrets.json", JSON.stringify(issuedSecrets, null, 2))
}
