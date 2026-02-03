package com.internalpj.crm_mini;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.scheduling.annotation.EnableScheduling;

@SpringBootApplication
@EnableScheduling
public class CrmMiniApplication {

	public static void main(String[] args) {
		SpringApplication.run(CrmMiniApplication.class, args);
	}

}
