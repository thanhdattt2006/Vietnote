package com.example.backend_spring;

import org.junit.jupiter.api.Disabled;
import org.junit.jupiter.api.Test;
import org.springframework.boot.test.context.SpringBootTest;

@SpringBootTest
@Disabled("Disabled because MySQL is not guaranteed to be running in the test environment")
class BackendSpringApplicationTests {

	@Test
	void contextLoads() {
	}

}
