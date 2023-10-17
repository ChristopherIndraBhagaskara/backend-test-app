CREATE TYPE status_enum AS ENUM ('0', '1');

CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    code VARCHAR(255) NOT NULL,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL,
    password VARCHAR(255) NOT NULL,
    status status_enum NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE customers (
    id SERIAL PRIMARY KEY,
    code VARCHAR(255) NOT NULL,
    name VARCHAR(255) NOT NULL,
    status status_enum NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE items (
    id SERIAL PRIMARY KEY,
    code VARCHAR(255) NOT NULL,
    sku VARCHAR(255),
    name VARCHAR(255) NOT NULL,
    price DECIMAL(10, 2) NOT NULL,
    status status_enum NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE transactions (
    id SERIAL PRIMARY KEY,
    code VARCHAR(255) NOT NULL,
    user_id INT REFERENCES users(id),
    customer_id INT REFERENCES customers(id),
    payment_method VARCHAR(255),
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE transaction_details (
    id SERIAL PRIMARY KEY,
    transaction_id INT REFERENCES transactions(id),
    item_id INT REFERENCES items(id),
    qty INT,
    price DECIMAL(10, 2)
);

CREATE TABLE stocks (
    id SERIAL PRIMARY KEY,
    item_id INT REFERENCES items(id),
    qty INT NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);