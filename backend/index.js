  // index.js

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

  // -------------------------------------
  // Endpoints Existentes
  // -------------------------------------

  // Obtener productos por género
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

  // Obtener detalles de un producto por ID
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
      SELECT TO_BASE64(ruta_imagen) AS imagen_base64
      FROM producto_imagen 
      WHERE modelo_id = ?
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
          console.error('Error al obtener las imágenes:', err);
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

  // Filtrar productos por categoría
  app.get('/productos/categoria/:categoria', (req, res) => {
    const categoria = req.params.categoria;
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

  // Obtener múltiples productos por sus IDs
  app.post('/cart/items', (req, res) => {
    const productIds = req.body.productIds;

    if (!Array.isArray(productIds) || productIds.length === 0) {
      return res.status(400).json({ error: 'No se proporcionaron producto_ids válidos.' });
    }

    const uniqueProductIds = [...new Set(productIds)];
    const placeholders = uniqueProductIds.map(() => '?').join(',');

    const query = `
      SELECT 
        p.producto_id,
        p.modelo_id,
        p.talla,
        p.stock,
        m.producto_nombre,
        m.descripcion,
        m.precio,
        ma.marca_nombre,
        c.categoria_nombre,
        GROUP_CONCAT(pi.ruta_imagen) AS imagenes
      FROM 
        producto p
      INNER JOIN modelo m ON p.modelo_id = m.modelo_id
      INNER JOIN marca ma ON m.marca_id = ma.marca_id
      INNER JOIN categoria c ON m.categoria_id = c.categoria_id
      LEFT JOIN producto_imagen pi ON m.modelo_id = pi.modelo_id
      WHERE 
        p.producto_id IN (${placeholders})
      GROUP BY 
        p.producto_id;
    `;

    db.query(query, uniqueProductIds, (err, results) => {
      if (err) {
        console.error('Error al obtener los productos del carrito:', err);
        return res.status(500).json({ error: 'Error al obtener los productos del carrito.' });
      }

      res.json(results);
    });
  });

  // -------------------------------------
  // Nuevos Endpoints Añadidos
  // -------------------------------------

  // Endpoint para crear una nueva dirección
  app.post('/direccion', (req, res) => {
    const { usuario_id, fullName, department, district, address, reference } = req.body;

    // Validar que todos los campos necesarios estén presentes
    if (!fullName || !department || !district || !address || !reference) {
      return res.status(400).json({ error: 'Todos los campos de la dirección son obligatorios.' });
    }

    // Insertar la nueva dirección en la base de datos
    const insertDireccionQuery = `
      INSERT INTO direccion (usuario_id, fullName, departmento, direccion, reference, distrito)
      VALUES (?, ?, ?, ?, ?, ?)
    `;
    
    db.query(insertDireccionQuery, [usuario_id || null, fullName, department, district, address, reference], (err, result) => {
      if (err) {
        console.error('Error al insertar la dirección:', err);
        return res.status(500).json({ error: 'Error al guardar la dirección.' });
      }

      const direccion_id = result.insertId;
      res.status(201).json({ direccion_id });
    });
  });

  // Endpoint para procesar el pedido
  // Endpoint para procesar el pedido
app.post('/pedido', (req, res) => {
  const { usuario_id, guest_email, monto_total, metodo_id, direccion_id, productos } = req.body;

  // Validación de los datos recibidos
  if ((!usuario_id && !guest_email) || !monto_total || !metodo_id || !direccion_id || !productos || !Array.isArray(productos) || productos.length === 0) {
    return res.status(400).json({ error: 'Datos del pedido incompletos o inválidos.' });
  }

  // Iniciar la transacción
  db.beginTransaction((err) => {
    if (err) {
      console.error('Error al iniciar la transacción:', err);
      return res.status(500).json({ error: 'Error interno del servidor.' });
    }

    // Validar que el direccion_id existe
    const checkDireccionQuery = `SELECT * FROM direccion WHERE direccion_id = ?`;
    db.query(checkDireccionQuery, [direccion_id], (err, direccionResults) => {
      if (err) {
        console.error('Error al verificar la dirección:', err);
        return db.rollback(() => {
          res.status(500).json({ error: 'Error al procesar el pedido.' });
        });
      }

      if (direccionResults.length === 0) {
        return db.rollback(() => {
          res.status(400).json({ error: 'La dirección proporcionada no existe.' });
        });
      }

      // Validar que el metodo_id existe
      const checkMetodoQuery = `SELECT * FROM pago_metodo WHERE metodo_id = ?`;
      db.query(checkMetodoQuery, [metodo_id], (err, metodoResults) => {
        if (err) {
          console.error('Error al verificar el método de pago:', err);
          return db.rollback(() => {
            res.status(500).json({ error: 'Error al procesar el pedido.' });
          });
        }

        if (metodoResults.length === 0) {
          return db.rollback(() => {
            res.status(400).json({ error: 'El método de pago proporcionado no existe.' });
          });
        }

        // Insertar en la tabla 'pedido'
        const insertPedidoQuery = `
          INSERT INTO pedido (usuario_id, guest_email, monto_total, metodo_id, direccion_id, estado_pedido)
          VALUES (?, ?, ?, ?, ?, 'Pendiente')
        `;
        db.query(insertPedidoQuery, [usuario_id || null, guest_email || null, monto_total, metodo_id, direccion_id], (err, result) => {
          if (err) {
            return db.rollback(() => {
              console.error('Error al insertar el pedido:', err);
              res.status(500).json({ error: 'Error al procesar el pedido.' });
            });
          }

          const pedido_id = result.insertId;

          // Función para insertar detalles del pedido y actualizar stock
          const insertarDetalles = (index) => {
            if (index >= productos.length) {
              // Todas las inserciones fueron exitosas, confirmar la transacción
              return db.commit((err) => {
                if (err) {
                  return db.rollback(() => {
                    console.error('Error al confirmar la transacción:', err);
                    res.status(500).json({ error: 'Error al procesar el pedido.' });
                  });
                }
                res.status(200).json({ mensaje: 'Pedido procesado exitosamente.', pedido_id });
              });
            }

            const { producto_id, cantidad } = productos[index];

            // Insertar en 'pedido_detalle'
            const insertDetalleQuery = `
              INSERT INTO pedido_detalle (pedido_id, producto_id, cantidad)
              VALUES (?, ?, ?)
            `;
            db.query(insertDetalleQuery, [pedido_id, producto_id, cantidad], (err, result) => {
              if (err) {
                return db.rollback(() => {
                  console.error('Error al insertar el detalle del pedido:', err);
                  res.status(500).json({ error: 'Error al procesar el pedido.' });
                });
              }

              // Actualizar el stock en 'producto'
              const updateStockQuery = `
                UPDATE producto
                SET stock = stock - ?
                WHERE producto_id = ? AND stock >= ?
              `;
              db.query(updateStockQuery, [cantidad, producto_id, cantidad], (err, result) => {
                if (err) {
                  return db.rollback(() => {
                    console.error('Error al actualizar el stock:', err);
                    res.status(500).json({ error: 'Error al procesar el pedido.' });
                  });
                }

                if (result.affectedRows === 0) {
                  // No se pudo actualizar el stock, posiblemente stock insuficiente
                  return db.rollback(() => {
                    console.error(`Stock insuficiente para el producto_id: ${producto_id}`);
                    res.status(400).json({ error: `Stock insuficiente para el producto con ID ${producto_id}.` });
                  });
                }

                // Proceder con el siguiente producto
                insertarDetalles(index + 1);
              });
            });
          };

          // Iniciar la inserción de detalles
          insertarDetalles(0);
        });
      });
    });
  });
});
;
