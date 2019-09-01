package ru.ifmo.se.iap.schoolOfPeopleX;

import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.autoconfigure.security.servlet.SecurityAutoConfiguration;
import ru.ifmo.se.iap.schoolOfPeopleX.service.PopulationService;

@SpringBootApplication(exclude = {SecurityAutoConfiguration.class})
public class SchoolOfPeopleXApplication implements CommandLineRunner {

	private final PopulationService populationService;

	public SchoolOfPeopleXApplication(final PopulationService populationService) {
		this.populationService = populationService;
	}

	public static void main(String[] args) {

		SpringApplication.run(SchoolOfPeopleXApplication.class, args);
	}

	@Override
	public void run(String... args) throws Exception {
//		populationService.populate();
	}
}
