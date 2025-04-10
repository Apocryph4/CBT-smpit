const express = require('express');
const supabase = require('./helper/connection');
const bodyParser = require('body-parser');
const cors = require('cors');


const app = express();
const port = 5000;

app.use(cors());
app.use(bodyParser.json());
app.use(express.json());


app.get('/siswa', async (req, res) => {
  const { data, error } = await supabase.from('pendaftar').select('*');
  if (error) return res.status(500).json({ error: error.message });
  res.json(data);
});

app.get('/siswa/:id', async (req, res) => {
  const { id } = req.params;

  try {
    const { data, error } = await supabase
      .from('pendaftar')
      .select('*')
      .eq('id', id)
      .single();

    if (error) return res.status(400).json({ error: error.message });

    res.json(data);
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});


// app.post('/pendaftar', async (req, res) => {
//   const { id_pendaftar, nama_lengkap, nama_panggilan, asal_sekolah, jalur_pendaftaran, status_pembayaran } = req.body

//   try {
//     const { data, error } = await supabase.from('pendaftar').insert([
//       {
//         id_pendaftar,
//         nama_lengkap,
//         nama_panggilan,
//         asal_sekolah,
//         jalur_pendaftaran,
//       }
//     ])

//     if (error) throw error
//     res.json({ message: 'Pendaftaran berhasil!', data })
//   } catch (err) {
//     res.status(500).json({ error: err.message })
//   }
// })


app.post('/login', async (req, res) => {
  const { nama_panggilan, id_pendaftar } = req.body;

  try {
    // Cari user berdasarkan nama dan id_pendaftar
    const { data, error } = await supabase
      .from('pendaftar')
      .select('*')
      .eq('nama_panggilan', nama_panggilan)
      .eq('id_pendaftar', id_pendaftar)
      .single();

    if (error || !data) {
      return res.status(401).json({ error: 'Nama atau ID Pendaftar salah' });
    }

    // Jika cocok, kirim data user
    return res.status(200).json({
      message: 'Login berhasil!',
      user: data
    });

  } catch (err) {
    console.error('Login error:', err);
    return res.status(500).json({ error: 'Terjadi kesalahan server' });
  }
});


app.listen(port, () => {
  console.log(`Server jalan di http://localhost:${port}`);
});