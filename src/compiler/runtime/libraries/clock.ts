import { LibraryTypeInstance, LibraryMethodInstance, LibraryPropertyInstance, LibraryEventInstance } from "../libraries";
import { StringValue } from "../values/string-value";
import { BaseValue } from "../values/base-value";

export class ClockLibrary implements LibraryTypeInstance {
    private getTime(): BaseValue {
        const time = new Date().toLocaleTimeString();
        return new StringValue(time);
    }

    private getDate(): BaseValue {
        const year  = this.getYear().toValueString();
        const month = this.getMonth().toValueString();
        const day   = this.getDay().toValueString();

        const date = month + "/" + day + "/" + year;
        return new StringValue(date);
    }

    private getYear(): BaseValue {
        const timestamp = new Date();
        const formattedYear = timestamp.getFullYear().toString();
        return new StringValue(formattedYear);
    }

    private getMonth(): BaseValue {
        const timestamp = new Date();
        const formattedMonth = ("0" + (timestamp.getMonth() + 1)).slice(-2);
        return new StringValue(formattedMonth);
    }

    private getDay(): BaseValue {
        const timestamp = new Date();
        const formattedDate = ("0" + timestamp.getDate()).slice(-2);
        return new StringValue(formattedDate);
    }

    private getWeekDay(): BaseValue {
        const timestamp = new Date();
        const formattedWeekDay = ("0" + (timestamp.getDay() + 1)).slice(-2);
        return new StringValue(formattedWeekDay);
    }

    private getHour(): BaseValue {
        const timestamp = new Date();
        const formattedHour = ("0" + timestamp.getHours()).slice(-2);
        return new StringValue(formattedHour);
    }

    private getMinute(): BaseValue {
        const timestamp = new Date();
        const formattedMinute = ("0" + timestamp.getMinutes()).slice(-2);
        return new StringValue(formattedMinute);
    }

    private getSecond(): BaseValue {
        const timestamp = new Date();
        const formattedSecond = ("0" + timestamp.getSeconds()).slice(-2);
        return new StringValue(formattedSecond);
    }

    private getMillisecond(): BaseValue {
        const timestamp = new Date();
        const formattedMillisecond = ("0" + timestamp.getMilliseconds()).slice(-3);
        return new StringValue(formattedMillisecond);
    }

    private getElapsedMilliseconds(): BaseValue {
        const unixepoch = (new Date).getTime();
        return new StringValue(unixepoch.toString());
    }

    public readonly methods: { readonly [name: string]: LibraryMethodInstance } = {};

    public readonly properties: { readonly [name: string]: LibraryPropertyInstance } = {
        Time               : { getter: this.getTime.bind(this)                },
        Date               : { getter: this.getDate.bind(this)                },
        Year               : { getter: this.getYear.bind(this)                },
        Month              : { getter: this.getMonth.bind(this)               },
        Day                : { getter: this.getDay.bind(this)                 },
        WeekDay            : { getter: this.getWeekDay.bind(this)             },
        Hour               : { getter: this.getHour.bind(this)                },
        Minute             : { getter: this.getMinute.bind(this)              },
        Second             : { getter: this.getSecond.bind(this)              },
        Millisecond        : { getter: this.getMillisecond.bind(this)         },
        ElapsedMilliseconds: { getter: this.getElapsedMilliseconds.bind(this) }
    };

    public readonly events: { readonly [name: string]: LibraryEventInstance } = {};
}
