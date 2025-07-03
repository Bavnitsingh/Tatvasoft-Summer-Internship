-- Step 1: Create the Customer Table
CREATE TABLE customer (
   customer_id SERIAL PRIMARY KEY, -- Auto-incrementing ID
   first_name VARCHAR(100) NOT NULL, -- Customer's first name
   last_name VARCHAR(100) NOT NULL, -- Customer's last name
   email VARCHAR(255) UNIQUE NOT NULL, -- Unique email
   created_date TIMESTAMPTZ NOT NULL DEFAULT NOW(), -- Record creation timestamp
   updated_date TIMESTAMPTZ -- Optional update timestamp
);

Select * from customer;

Drop Table if Exists customer;

-- Add and delete columns
Alter Table customer Add column active boolean;
Alter table customer drop column active ;

-- Rename Columns
Alter table customer rename column email to email_address;
Alter Table customer rename column email_address to email;

-- Rename Table
Alter table customer Rename to users;
Alter table users rename to customer; 

-- Create order details
create table orders(
order_id serial primary key,
customer_id integer not null
references customer(customer_id),
order_date Timestamp not null
default Now(),
order_number varchar(50) not null,
order_amount decimal(10,2) not null
)

-- Insert a single record in customer
Insert into customer(first_name,last_name,email,created_date,updated_date,active)
values('Bavnit','Singh','bavnit@gmail.com',Now(),Null,true);

-- select * from customer

-- Insert multiple records
insert into customer (first_name,last_name,email,created_date,updated_date,active)
values('Harman','singh','harman@gmail.com',Now(),Null,true),
('Harpreet','singh','harpreet@gmail.com',Now(),Null,true),
('Jasmit','singh','jasmit@gmail.com',Now(),Null,true),
('Gurmeet','singh','gurmit@gmail.com',Now(),Null,true);

-- Insert Orders
INSERT INTO orders (customer_id, order_date, order_number, order_amount) VALUES
  (1, '2024-01-01', 'ORD001', 50.00),
  (2, '2024-01-01', 'ORD002', 35.75),
  (3, '2024-01-01', 'ORD003', 100.00),
  (4, '2024-01-01', 'ORD004', 30.25),
  (5, '2024-01-01', 'ORD005', 90.75);

-- Basic Select Queries
-- 1) Using PostgreSQL SELECT statement to query data from one column example
select first_name from customer;
-- 2) Using PostgreSQL SELECT statement to query data from multiple columns example
select first_name,last_name,email,active from customer;
-- 3) Using PostgreSQL SELECT statement to query data from all columns of a table example
select * from customer;

-- Order By Queries
select first_name,last_name from customer order by first_name asc ;
select first_name,last_name from customer order by  last_name desc ;
select first_name,last_name from customer order by first_name asc ,last_name desc;

-- Where Clause examples
select first_name,last_name from customer where first_name = 'Harpreet';
select customer_id , first_name,last_name from customer where first_name = 'Bavnit';
SELECT customer_id, first_name, last_name FROM customer WHERE first_name IN ('John', 'Daud', 'Jasmit');

-- Join Examples
select * from orders as o inner join customer as c on o.customer_id = c.customer_id;
select * from orders as o left join customer as c on o.customer_id = c.customer_id;
select * from orders as o right join customer as c on o.customer_id = c.customer_id;

-- Aggregation with group by
select c.customer_id,c.first_name,c.last_name,c.email,
count(o.order_id) as noOfOrders,
sum(o.order_amount) as total
from customer as c
inner join orders as o on c.customer_id = o.customer_id
group by c.customer_id;

-- GROUP BY with HAVING
SELECT c.customer_id, c.first_name, c.last_name, c.email,
       COUNT(o.order_id) AS No_Orders,
       SUM(o.order_amount) AS Total
FROM customer AS c
INNER JOIN orders AS o ON c.customer_id = o.customer_id
GROUP BY c.customer_id
HAVING COUNT(o.order_id) >= 1;

-- Subqueries

-- 1) PostgreSQL subquery with IN operator
SELECT * FROM orders WHERE customer_id IN (
  SELECT customer_id FROM customer WHERE active = true
);
-- 2) PostgreSQL subquery with EXISTS operator
SELECT customer_id, first_name, last_name, email
FROM customer
WHERE EXISTS (
  SELECT 1 FROM orders WHERE orders.customer_id = customer.customer_id
);

-- Update Statement
UPDATE customer
SET first_name = 'Dilip', last_name = 'singh', email = 'dilip@tatvasoft.com'
WHERE customer_id = 3;

-- Delete statement
delete from customer where customer_id = 2;










