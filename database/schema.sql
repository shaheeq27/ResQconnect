CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(150) UNIQUE NOT NULL,
    phone VARCHAR(15) UNIQUE NOT NULL,
    password_hash TEXT NOT NULL,
    occupation VARCHAR(100),
    blood_group VARCHAR(5),
    latitude DECIMAL(10, 7),
    longitude DECIMAL(10, 7),
    address TEXT,
    role VARCHAR(20) NOT NULL DEFAULT 'seeker',
    availability_status VARCHAR(20) DEFAULT 'available',
    verification_status VARCHAR(20) DEFAULT 'pending',
    last_located_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT users_role_check
        CHECK (role IN ('seeker', 'provider', 'manager', 'admin')),

    CONSTRAINT users_availability_check
        CHECK (availability_status IN ('available', 'busy', 'offline')),

    CONSTRAINT users_verification_check
        CHECK (verification_status IN ('pending', 'verified', 'rejected'))
);
CREATE TABLE service_categories (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) UNIQUE NOT NULL,
    description TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
CREATE TABLE provider_services (
    id SERIAL PRIMARY KEY,
    provider_id INTEGER NOT NULL,
    service_category_id INTEGER NOT NULL,
    is_available BOOLEAN DEFAULT TRUE,

    CONSTRAINT fk_provider
        FOREIGN KEY (provider_id)
        REFERENCES users(id)
        ON DELETE CASCADE,

    CONSTRAINT fk_service_category
        FOREIGN KEY (service_category_id)
        REFERENCES service_categories(id)
        ON DELETE CASCADE,

    CONSTRAINT unique_provider_service
        UNIQUE (provider_id, service_category_id)
);
CREATE TABLE help_requests (
    id SERIAL PRIMARY KEY,

    requester_id INTEGER NOT NULL,

    request_type VARCHAR(20) NOT NULL,

    emergency_type VARCHAR(100),

    title VARCHAR(150) NOT NULL,

    description TEXT,

    latitude DECIMAL(10, 7) NOT NULL,

    longitude DECIMAL(10, 7) NOT NULL,

    address TEXT,

    agreed_price DECIMAL(10, 2),

    status VARCHAR(30) DEFAULT 'pending_verification',

    assigned_provider_id INTEGER,

    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT fk_requester
        FOREIGN KEY (requester_id)
        REFERENCES users(id)
        ON DELETE CASCADE,

    CONSTRAINT fk_assigned_provider
        FOREIGN KEY (assigned_provider_id)
        REFERENCES users(id)
        ON DELETE SET NULL,

    CONSTRAINT request_type_check
        CHECK (request_type IN ('emergency', 'non_emergency')),

    CONSTRAINT request_status_check
        CHECK (
            status IN (
                'pending_verification',
                'approved',
                'rejected',
                'bargaining',
                'assigned',
                'accepted',
                'in_progress',
                'completed',
                'cancelled'
            )
        )
);

CREATE TABLE bargain_offers (
    id SERIAL PRIMARY KEY,
    request_id INTEGER NOT NULL,
    provider_id INTEGER NOT NULL,
    seeker_id INTEGER NOT NULL,
    sender_role VARCHAR(20) NOT NULL,
    offered_price DECIMAL(10, 2) NOT NULL,
    status VARCHAR(20) DEFAULT 'pending',
    round_number INTEGER DEFAULT 1,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT fk_bargain_request
        FOREIGN KEY (request_id)
        REFERENCES help_requests(id)
        ON DELETE CASCADE,
    CONSTRAINT fk_bargain_provider
        FOREIGN KEY (provider_id)
        REFERENCES users(id)
        ON DELETE CASCADE,
    CONSTRAINT fk_bargain_seeker
        FOREIGN KEY (seeker_id)
        REFERENCES users(id)
        ON DELETE CASCADE,
    CONSTRAINT bargain_status_check
        CHECK (status IN ('pending', 'accepted', 'rejected', 'countered'))
);
CREATE TABLE manager_verifications (
    id SERIAL PRIMARY KEY,

    request_id INTEGER NOT NULL,

    manager_id INTEGER NOT NULL,

    decision VARCHAR(20) NOT NULL,

    remarks TEXT,

    verified_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT fk_verification_request
        FOREIGN KEY (request_id)
        REFERENCES help_requests(id)
        ON DELETE CASCADE,

    CONSTRAINT fk_verification_manager
        FOREIGN KEY (manager_id)
        REFERENCES users(id)
        ON DELETE CASCADE,

    CONSTRAINT verification_decision_check
        CHECK (decision IN ('approved', 'rejected'))
);
CREATE TABLE locations (
    id SERIAL PRIMARY KEY,

    user_id INTEGER NOT NULL,

    latitude DECIMAL(10, 7) NOT NULL,

    longitude DECIMAL(10, 7) NOT NULL,

    recorded_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT fk_location_user
        FOREIGN KEY (user_id)
        REFERENCES users(id)
        ON DELETE CASCADE
);
CREATE TABLE request_status_history (
    id SERIAL PRIMARY KEY,

    request_id INTEGER NOT NULL,

    status VARCHAR(30) NOT NULL,

    changed_by INTEGER,

    remarks TEXT,

    changed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT fk_status_request
        FOREIGN KEY (request_id)
        REFERENCES help_requests(id)
        ON DELETE CASCADE,

    CONSTRAINT fk_status_user
        FOREIGN KEY (changed_by)
        REFERENCES users(id)
        ON DELETE SET NULL
);
CREATE TABLE chats (
    id SERIAL PRIMARY KEY,

    request_id INTEGER NOT NULL UNIQUE,

    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT fk_chat_request
        FOREIGN KEY (request_id)
        REFERENCES help_requests(id)
        ON DELETE CASCADE
);
CREATE TABLE messages (
    id SERIAL PRIMARY KEY,

    chat_id INTEGER NOT NULL,

    sender_id INTEGER NOT NULL,

    message TEXT NOT NULL,

    sent_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    is_read BOOLEAN DEFAULT FALSE,

    CONSTRAINT fk_message_chat
        FOREIGN KEY (chat_id)
        REFERENCES chats(id)
        ON DELETE CASCADE,

    CONSTRAINT fk_message_sender
        FOREIGN KEY (sender_id)
        REFERENCES users(id)
        ON DELETE CASCADE
);
CREATE TABLE notifications (
    id SERIAL PRIMARY KEY,

    user_id INTEGER NOT NULL,

    request_id INTEGER,

    type VARCHAR(50) NOT NULL,

    title VARCHAR(150) NOT NULL,

    message TEXT NOT NULL,

    is_read BOOLEAN DEFAULT FALSE,

    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT fk_notification_user
        FOREIGN KEY (user_id)
        REFERENCES users(id)
        ON DELETE CASCADE,

    CONSTRAINT fk_notification_request
        FOREIGN KEY (request_id)
        REFERENCES help_requests(id)
        ON DELETE CASCADE
);

CREATE TABLE provider_request_interests (
    id SERIAL PRIMARY KEY,
    request_id INTEGER NOT NULL,
    provider_id INTEGER NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT fk_interest_request
        FOREIGN KEY (request_id)
        REFERENCES help_requests(id)
        ON DELETE CASCADE,

    CONSTRAINT fk_interest_provider
        FOREIGN KEY (provider_id)
        REFERENCES users(id)
        ON DELETE CASCADE,

    CONSTRAINT unique_request_provider_interest
        UNIQUE (request_id, provider_id)
);

   
CREATE TABLE payments (
    id SERIAL PRIMARY KEY,

    request_id INTEGER NOT NULL,

    payer_id INTEGER NOT NULL,

    provider_id INTEGER NOT NULL,

    amount DECIMAL(10, 2) NOT NULL,

    payment_method VARCHAR(30),

    transaction_id VARCHAR(150) UNIQUE,

    payment_status VARCHAR(20) DEFAULT 'pending',

    paid_at TIMESTAMP,

    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT fk_payment_request
        FOREIGN KEY (request_id)
        REFERENCES help_requests(id)
        ON DELETE CASCADE,

    CONSTRAINT fk_payment_payer
        FOREIGN KEY (payer_id)
        REFERENCES users(id)
        ON DELETE CASCADE,

    CONSTRAINT fk_payment_provider
        FOREIGN KEY (provider_id)
        REFERENCES users(id)
        ON DELETE CASCADE,

    CONSTRAINT payment_status_check
        CHECK (
            payment_status IN (
                'pending',
                'successful',
                'failed',
                'refunded'
            )
        )
);
CREATE TABLE ratings_reviews (
    id SERIAL PRIMARY KEY,

    request_id INTEGER NOT NULL,

    reviewer_id INTEGER NOT NULL,

    reviewee_id INTEGER NOT NULL,

    rating INTEGER NOT NULL,

    review TEXT,

    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT fk_rating_request
        FOREIGN KEY (request_id)
        REFERENCES help_requests(id)
        ON DELETE CASCADE,

    CONSTRAINT fk_reviewer
        FOREIGN KEY (reviewer_id)
        REFERENCES users(id)
        ON DELETE CASCADE,

    CONSTRAINT fk_reviewee
        FOREIGN KEY (reviewee_id)
        REFERENCES users(id)
        ON DELETE CASCADE,

    CONSTRAINT rating_range
        CHECK (rating BETWEEN 1 AND 5),

    CONSTRAINT unique_request_reviewer
        UNIQUE (request_id, reviewer_id)
);