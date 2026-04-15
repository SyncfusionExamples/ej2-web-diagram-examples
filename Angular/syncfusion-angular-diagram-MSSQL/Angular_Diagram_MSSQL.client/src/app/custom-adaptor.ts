import {
  DataManager,
  UrlAdaptor,
  Query,
  ReturnOption,
  DataResult,
} from '@syncfusion/ej2-data';

export class CustomAdaptor extends UrlAdaptor {

  public override processResponse(data: DataResult): ReturnOption {
    // Optionally post-process diagram data here
    return data;
  }


  public override beforeSend(
    dm: DataManager,
    request: Request,
    settings?: any,
  ): void {
    super.beforeSend(dm, request, settings);
  }

  // The following CRUD methods are commented out for now, as only read is needed for diagram.
  // Uncomment and adjust as needed if CRUD is required in the future.

  public override insert(dm: DataManager, data: DataResult) {
    return {
      url: `${dm.dataSource['insertUrl']}`,
      type: 'POST',
      contentType: 'application/json; charset=utf-8',
      data: JSON.stringify({ value: data }),
    };
  }

  public override update(dm: DataManager, _keyField: string, value: any) {
    return {
      url: `${dm.dataSource['updateUrl']}`,
      type: 'POST',
      contentType: 'application/json; charset=utf-8',
      data: JSON.stringify({ value }),
    };
  }

  public override remove(dm: DataManager, keyField: string, value: any) {
    const keyValue =
      value && typeof value === 'object' ? value[keyField] : value;
    return {
      url: `${dm.dataSource['removeUrl']}`,
      type: 'POST',
      contentType: 'application/json; charset=utf-8',
      data: JSON.stringify({ key: keyValue }),
    };
  }
}
