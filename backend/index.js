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

  app.get('/productos/:genero', (req, res) => {
    const genero = req.params.genero;
    const query = ` 
             SELECT 
            m.*, 
            pi.imagen_id, 
            TO_BASE64(pi.ruta_imagen) AS imagen_base64
        FROM 
            modelo m
        LEFT JOIN 
            producto_imagen pi ON m.modelo_id = pi.modelo_id
        WHERE 
            m.genero = ?
        GROUP BY 
            m.modelo_id;
    `;
  
    db.query(query, [genero], (err, results) => {
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
    
    const query1 = `
      SELECT 
        producto.producto_id,
        producto.modelo_id,
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
  
    const query2 = `
  SELECT             TO_BASE64(ruta_imagen) AS imagen_base64
 from producto_imagen where modelo_id = ?
    `;
  
    // Ejecutar la primera consulta
    db.query(query1, [productoId], (err, results1) => {
      if (err) {
        console.error('Error al obtener el producto:', err);
        res.status(500).send(err);
        return;
      }
  
      // Ejecutar la segunda consulta usando el mismo productoId
      db.query(query2, [productoId], (err, results2) => {
        if (err) {
          console.error('Error al obtener las reseñas:', err);
          res.status(500).send(err);
          return;
        }
  
        // Unir los resultados de ambas consultas en una respuesta
        res.json({
          producto: results1,
          imagenes: results2
        });
      });
    });
  });
  
  

  // Endpoint para filtrar productos por categoría
app.get('/productos/categoria/:categoria', (req, res) => {
  const categoria = req.params.categoria; // Obtener la categoría desde los parámetros de la URL
  const query = `
    SELECT 
      producto.producto_id,
      producto.modelo_id,
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
