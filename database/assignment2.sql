-- Query 1: Insert Tony Stark into account table
INSERT INTO account 
	(account_firstname, account_lastname, account_email, account_password)
VALUES
	('Tony', 'Stark', 'tony@starkent.com', 'Iam1ronM@n');


-- Query 2: Update account_type for Tony Stark in the account table
UPDATE account
SET account_type = 'Admin'
WHERE account_id = 1;


-- Query 3: Delete Tony Stark from account table
DELETE FROM account
WHERE account_id = 1;


-- Query 4: Update inv_description for GM Hummer
UPDATE inventory
SET inv_description = REPLACE(inv_description, 'the small interiors', 'a huge interior')
WHERE inv_id = 10;


-- Query 5: Inner join to select make and model on the Sport category
SELECT inv_make, inv_model
FROM inventory
INNER JOIN classification
	ON classification.classification_id = inventory.classification_id
WHERE classification.classification_id = 2;


-- Query 6: Update all records in the inventory table '/vehicles'
UPDATE inventory
SET inv_image = REPLACE(inv_image, '/images', '/images/vehicles');


