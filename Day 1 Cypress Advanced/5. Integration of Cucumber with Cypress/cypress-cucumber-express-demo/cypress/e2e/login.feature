Feature: Login API

  As a client of the API
  I want to log in with valid credentials
  So that I can access protected resources

  Scenario: Successful login with valid credentials
    Given the API is running
    When I login with username "admin" and password "secret"
    Then I should get a 200 response
    And the response should indicate success

  Scenario: Failed login with invalid credentials
    Given the API is running
    When I login with username "wrong" and password "user"
    Then I should get a 401 response
    And the response should indicate failure
