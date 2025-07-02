-- Drop table if exists
DROP TABLE IF EXISTS taxi_rides;

-- Create taxi_rides table
CREATE TABLE taxi_rides (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    user_id BIGINT,
    driver_id BIGINT,
    vehicle_id BIGINT,
    pickup_location VARCHAR(255),
    dropoff_location VARCHAR(255),
    fare DECIMAL,
    status INTEGER,
    requested_at DATETIME,
    started_at DATETIME,
    completed_at DATETIME,
    created_at DATETIME,
    updated_at DATETIME,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE NO ACTION ON UPDATE CASCADE,
    FOREIGN KEY (driver_id) REFERENCES taxi_drivers(id) ON DELETE CASCADE ON UPDATE CASCADE,
    FOREIGN KEY (vehicle_id) REFERENCES taxi_vehicles(id) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4; 