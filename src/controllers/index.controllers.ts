import { Request, Response } from 'express';
import { pool } from '../database';




  export const shortenUrl = async (req: Request, res: Response): Promise<Response> => {
	try{
		 const { longUrl } = req.body;

		 //generate code

		 let shortCode = Math.random().toString().substring(2, 7);

		 //check if it is unique

		 const searchQuery = 'SELECT * FROM Url WHERE shortUrl = $1'
		 let searchResponse = await pool.query(searchQuery, [shortCode]);
		 let counter = 0;
		 let isUnique = false;
		 do{
			searchResponse = await pool.query(searchQuery, [shortCode]);
			if(searchResponse.rows.length > 0){
				counter++;
				shortCode = Math.random().toString().substring(2, 7);
			} else isUnique = true;
		 }while(counter <= 5 && isUnique === false);


		 if(counter > 5){
			return res.status(400).json({ error: 'Cannot be shortened' });
		 }

		

		 const insertUrlQuery = 'INSERT INTO Url (shortUrl, longUrl) VALUES ($1, $2) RETURNING id';
		 await pool.query(insertUrlQuery,[shortCode, longUrl]);

		 return res.status(200).json({
			Url: {
			longUrl: longUrl,
			shortUrl: shortCode
			},
		});

		
	}catch (error) {
	  console.error(error);
	  return res.status(500).json('Internal Server error');
	}

  };


  export const redirect  = async (req: Request, res: Response): Promise<Response> => {
		try{

			const { code } = req.params;
			const shortUrl = code;
			
			const searchQuery = 'SELECT * FROM Url WHERE shortUrl = $1'
			const searchResponse = await pool.query(searchQuery, [shortUrl]);

			if(searchResponse.rows.length > 0) {
				const longUrl = searchResponse.rows[0]['longurl']
				res.redirect(301,"https://"+longUrl);
				return res.status(200).json({
					Url: {
					longUrl: longUrl,
					shortUrl: shortUrl
					},
				});
				
			} else {
				return res.status(400).json({ error: 'Cannot find ShortUrl' });
			}


		} catch (error) {
			console.error(error);
			return res.status(500).json('Internal Server error');
		  }
  };
