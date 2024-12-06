  const express = require('express');
  const mysql = require('mysql');
  const bodyParser = require('body-parser');
  const cors = require('cors');

  const app = express();
  app.use(bodyParser.json());
  app.use(cors());

  const db = mysql.createConnection({
    host: 'localhost',
    user: 'root', 
    password: '', 
    database: 'zapato' 
  });

  db.connect((err) => {
    if (err) {
      console.error('Error conectando a la base de datos:', err);
      return;
    }
    console.log('Conectado a la base de datos.');
  });

  const PORT = 3000;
  app.listen(PORT, () => {
    console.log(`Servidor corriendo en http://localhost:${PORT}`);
  });

  app.get('/productos', (req, res) => {
    const query = `
      SELECT * FROM modelo
    `;
  
    db.query(query, (err, results) => {
      if (err) {
        console.error('Error al obtener productos:', err);
        res.status(500).send(err);
        return;
      }
      res.json(results);
    });
  });

  app.get('/item/:id', (req, res) => {
    const productoId = req.params.id;
    const query = `
      SELECT 
    producto.producto_id,
    producto.modelo_id,
    producto.genero,
    producto.talla,
    producto.stock,
    modelo.producto_nombre,
    modelo.descripcion,
    modelo.precio,
    marca.marca_nombre,
    categoria.categoria_nombre,
    GROUP_CONCAT(producto_imagen.ruta_imagen) AS imagenes
FROM 
    producto
INNER JOIN modelo ON producto.modelo_id = modelo.modelo_id
INNER JOIN marca ON modelo.marca_id = marca.marca_id
INNER JOIN categoria ON modelo.categoria_id = categoria.categoria_id
LEFT JOIN producto_imagen ON modelo.modelo_id = producto_imagen.modelo_id
WHERE 
    producto.modelo_id = ?
GROUP BY 
    producto.producto_id;
    `;
  
    db.query(query, [productoId], (err, results) => {
      if (err) {
        console.error('Error al obtener el producto:', err);
        res.status(500).send(err);
        return;
      }
      res.json(results);
    });
  });
  

  // Endpoint para filtrar productos por categoría
app.get('/productos/categoria/:categoria', (req, res) => {
  const categoria = req.params.categoria; // Obtener la categoría desde los parámetros de la URL
  const query = `
    SELECT 
      producto.producto_id,
      producto.modelo_id,
      producto.genero,
      producto.talla,
      producto.stock,
      modelo.producto_nombre,
      modelo.descripcion,
      modelo.precio,
      marca.marca_nombre,
      categoria.categoria_nombre,
      GROUP_CONCAT(producto_imagen.ruta_imagen) AS imagenes
    FROM 
      producto
    INNER JOIN modelo ON producto.modelo_id = modelo.modelo_id
    INNER JOIN marca ON modelo.marca_id = marca.marca_id
    INNER JOIN categoria ON modelo.categoria_id = categoria.categoria_id
    LEFT JOIN producto_imagen ON modelo.modelo_id = producto_imagen.modelo_id
    WHERE 
      categoria.categoria_nombre = ?
    GROUP BY 
      producto.producto_id;
  `;

  db.query(query, [categoria], (err, results) => {
    if (err) {
      console.error('Error al filtrar productos por categoría:', err);
      res.status(500).send(err);
      return;
    }
    res.json(results);
  });
});
