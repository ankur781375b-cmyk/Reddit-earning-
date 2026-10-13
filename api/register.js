
module.exports = async (req, res) => {
  if (req.method !== "POST") {
    return res.status(405).json({
      error: "Method not allowed"
    });
  }

  try {
    const { name, mobile } = req.body || {};

    if (
      typeof name !== "string" ||
      !name.trim() ||
      typeof mobile !== "string" ||
      !/^[0-9]{10}$/.test(mobile)
    ) {
      return res.status(400).json({
        error: "Valid name and 10-digit mobile number required"
      });
    }

    const supabaseUrl = process.env.SUPABASE_URL;
    const secretKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

    if (!supabaseUrl || !secretKey) {
      return res.status(500).json({
        error: "Server configuration incomplete"
      });
    }

    const response = await fetch(
      `${supabaseUrl}/rest/v1/registrations`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "apikey": secretKey,
          "Authorization": `Bearer ${secretKey}`,
          "Prefer": "return=minimal"
        },
        body: JSON.stringify({
          name: name.trim(),
          mobile: mobile
        })
      }
    );

    if (!response.ok) {
      return res.status(500).json({
        error: "Registration could not be saved"
      });
    }

    return res.status(201).json({
      message: "Registration successful"
    });
  } catch (error) {
    return res.status(500).json({
      error: "Something went wrong"
    });
  }
};
