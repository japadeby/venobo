export class UnknownDatabaseException extends Error {

  public name = 'UnknownDatabaseException';

  constructor(database: string) {
    super(
      `Database ${database} doesn't exist.`
    );
  };

}
