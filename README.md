# React Nepali Datepicker

> Nepali Datepicker as a ReactJS input component with popover

[![NPM](https://img.shields.io/npm/v/react-nepali-datepicker-bs.svg)](https://www.npmjs.com/package/react-nepali-datepicker-bs)
[![JavaScript Style Guide](https://img.shields.io/badge/code_style-standard-brightgreen.svg)](https://standardjs.com)

## Demo

![NepaliDatePicker Demo](example.png)

## Install

```bash
npm install --save react-nepali-datepicker-bs

or,

yarn add react-nepali-datepicker-bs
```

## Usage

#### For Typescript

```tsx
import React, { useState } from "react"
import { NepaliDatePicker } from "react-nepali-datepicker-bs"
import "react-nepali-datepicker-bs/dist/index.css"

const App = () => {
    const [date, setDate] = useState<string>("")

    return (
        <form>
            <label htmlFor='date'>Date</label>
            <NepaliDatePicker
                inputClassName='form-control'
                className=''
                value={date}
                onChange={(value: string) => setDate(value)}
                options={{ calenderLocale: "ne", valueLocale: "en" }}
                placeholder={"Enter DOB"}
                todayIfEmpty={false}
            />
        </form>
    )
}

export default App
```

#### For JavaScript

```jsx
import React, { useState } from "react"
import { NepaliDatePicker } from "react-nepali-datepicker-bs"
import "react-nepali-datepicker-bs/dist/index.css"

const App = () => {
    const [date, setDate] = useState("")

    return (
        <form>
            <label htmlFor='date'>Date</label>
            <NepaliDatePicker
                inputClassName='form-control'
                className=''!
                value={date}
                onChange={(value) => setDate(value)}
                options={{ calenderLocale: "ne", valueLocale: "en" }}
                placeholder={"Enter DOB"}
                todayIfEmpty={false}
            />
        </form>
    )
}

export default App
```

## Reference

MIT © [https://github.com/puncoz-official](https://github.com/puncoz-official)
