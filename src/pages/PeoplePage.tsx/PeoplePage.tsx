import React, { useEffect, useState } from 'react';
import { Loader } from '../../components/Loader';
import { Person } from '../../types';
import { getPeople } from '../../utils/Actions';
import { PersonLink } from '../../components/PersonLink';
import { useParams } from 'react-router-dom';
import classNames from 'classnames';

function prepearPeople(people: Person[]) {
  return people.map(person => {
    let prepearedPerson = { ...person };
    const mother = people.find(
      personMother => person.motherName === personMother.name,
    );
    const father = people.find(
      personFather => person.fatherName === personFather.name,
    );

    if (mother) {
      prepearedPerson = { ...prepearedPerson, mother: mother };
    }

    if (father) {
      prepearedPerson = { ...prepearedPerson, father: father };
    }

    return prepearedPerson;
  });
}

export const PeoplePage = () => {
  const [people, setPeople] = useState<Person[] | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isError, setIsError] = useState(true);
  const { slug } = useParams();

  useEffect(() => {
    setIsError(false);
    setIsLoading(true);
    getPeople()
      .then(response => {
        const prepearedPeople = prepearPeople(response);

        setPeople(prepearedPeople);
      })
      .catch(() => setIsError(true))
      .finally(() => setIsLoading(false));
  }, []);

  return (
    <>
      <h1 className="title">People Page</h1>
      <div className="block">
        <div className="box table-container">
          {isLoading && <Loader />}

          {isError && (
            <p data-cy="peopleLoadingError" className="has-text-danger">
              Something went wrong
            </p>
          )}

          {people?.length === 0 && !isLoading && (
            <p data-cy="noPeopleMessage">There are no people on the server</p>
          )}

          {people && people.length > 0 && !isLoading && (
            <table
              data-cy="peopleTable"
              className="table is-striped is-hoverable is-narrow is-fullwidth"
            >
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Sex</th>
                  <th>Born</th>
                  <th>Died</th>
                  <th>Mother</th>
                  <th>Father</th>
                </tr>
              </thead>

              <tbody>
                {people?.map(person => (
                  <tr
                    key={person.slug}
                    data-cy="person"
                    className={classNames({
                      'has-background-warning': slug === person.slug,
                    })}
                  >
                    <td>
                      <PersonLink person={person} />
                    </td>

                    <td>{person.sex}</td>
                    <td>{person.born}</td>
                    <td>{person.died}</td>
                    <td
                      className={classNames({
                        'has-text-danger': person.sex === 'f',
                      })}
                    >
                      {person.mother ? (
                        <PersonLink person={person.mother} />
                      ) : person.motherName ? (
                        person.motherName
                      ) : (
                        '-'
                      )}
                    </td>
                    <td>
                      {person.father ? (
                        <PersonLink person={person.father} />
                      ) : person.fatherName ? (
                        person.fatherName
                      ) : (
                        '-'
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </>
  );
};
