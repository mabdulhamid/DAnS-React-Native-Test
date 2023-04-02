import React, { useState, useEffect } from "react";
import {
  StyleSheet,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  FlatList,
  ActivityIndicator,
} from "react-native";
import axios from "axios";

export default function JobListScreen({ navigation }) {
  const [jobs, setJobs] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [location, setLocation] = useState("");
  const [fullTime, setFullTime] = useState(false);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [condition, setCondition] = useState(false);

  const fetchJobs = async () => {
    try {
      setLoading(true);
      const response = await axios.get(
        `http://dev3.dansmultipro.co.id/api/recruitment/positions.json?description=${
          searchTerm ? searchTerm : null
        }&location=${location ? location : null}&full_time=${
          fullTime == true ? fullTime : false
        }`
      );
      setJobs(response?.data?.length > 0 ? response.data : null);
      setPage((prevPage) => prevPage + 1);
      setLoading(false);
    } catch (error) {
      console.error(error);
      setLoading(false);
    }
  };

  const fetchJobsList = async (status) => {
    try {
      setLoading(true);
      const response = await axios.get(
        `http://dev3.dansmultipro.co.id/api/recruitment/positions.json?page=${page}`
      );
      setJobs(status == "more" ? [...jobs, ...response.data] : response?.data);
      setPage(page + 1);
      setLoading(false);
    } catch (error) {
      console.error(error);
      setLoading(false);
    }
  };

  useEffect(() => {
    if (condition == false) {
      setJobs([]);
      fetchJobsList("new");
    }
  }, [condition]);

  const handleSearch = () => {
    setJobs([]);
    fetchJobs();
  };

  const renderJobItem = ({ item }) => {
    return (
      <TouchableOpacity
        style={styles.jobItem}
        onPress={() =>
          navigation.navigate("JobDetailScreen", { jobId: item?.id })
        }
      >
        <View style={styles.rowBetween}>
          <View>
            <Text style={styles.jobTitle}>{item?.title}</Text>
            <Text style={styles.jobCompany}>{item?.company}</Text>
            <Text style={styles.jobLocation}>{item?.location}</Text>
          </View>
          <View style={styles.center}>
            <Text>{">"}</Text>
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  const renderFooter = () => {
    if (loading) {
      return (
        <View style={styles.loading}>
          <ActivityIndicator size="large" color="#1a73e8" />
        </View>
      );
    } else {
      return null;
    }
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity
        onPress={() => {
          setCondition(!condition);
          if (condition == true) {
            setFullTime(false);
            setLocation("");
            setSearchTerm("");
            setPage(1);
          }
        }}
      >
        <View style={styles.searchContainer}>
          <View style={styles.search}>
            {(condition == false && (
              <Text>Click here for searching something...</Text>
            )) ||
              (condition == true && <Text>Click here to back...</Text>)}
          </View>
        </View>
      </TouchableOpacity>
      {condition == true && (
        <View style={styles.searchForm}>
          <TextInput
            style={styles.input}
            placeholder="Search by description"
            onChangeText={(text) => setSearchTerm(text)}
            value={searchTerm}
          />
          <TextInput
            style={styles.input}
            placeholder="Search by location"
            onChangeText={(text) => setLocation(text)}
            value={location}
          />
          <View style={styles.checkboxContainer}>
            <Text style={styles.checkboxLabel}>Full time only:</Text>
            <TouchableOpacity
              style={styles.checkbox}
              onPress={() => setFullTime(!fullTime)}
            >
              {fullTime && <View style={styles.checkboxTick} />}
            </TouchableOpacity>
          </View>
          <TouchableOpacity style={styles.button} onPress={handleSearch}>
            <Text style={styles.buttonText}>Search</Text>
          </TouchableOpacity>
        </View>
      )}

      {(jobs != null && (
        <FlatList
          data={jobs}
          renderItem={renderJobItem}
          keyExtractor={(item) => item?.id.toString()}
          onEndReached={() => {
            if (condition == false) {
              fetchJobsList("more");
            }
          }}
          onEndReachedThreshold={0.5}
          ListFooterComponent={renderFooter}
        />
      )) ||
        (jobs == null && (
          <View style={styles.loading}>
            <Text style={styles.jobTitle}>No Data Found</Text>
          </View>
        ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  rowBetween: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  center: {
    justifyContent: "center",
  },
  searchContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 10,
  },
  searchForm: {
    backgroundColor: "#f5f5f5",
    padding: 10,
    marginBottom: 10,
  },
  search: {
    backgroundColor: "#fff",
    flex: 1,
    padding: 10,
    marginBottom: 10,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#ccc",
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 4,
    padding: 10,
    margin: 10,
  },
  checkboxContainer: {
    flexDirection: "row",
    alignItems: "center",
    margin: 10,
  },
  checkboxLabel: {
    fontSize: 16,
    marginRight: 10,
  },
  checkbox: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 4,
    width: 20,
    height: 20,
    alignItems: "center",
    justifyContent: "center",
  },
  checkboxTick: {
    width: 10,
    height: 10,
    backgroundColor: "#1a73e8",
    borderRadius: 2,
  },
  button: {
    backgroundColor: "#1a73e8",
    padding: 10,
    borderRadius: 4,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 10,
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
  },
  jobItem: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 4,
    padding: 10,
    margin: 10,
  },
  jobTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 5,
  },
  jobCompany: {
    fontSize: 16,
    marginBottom: 5,
  },
  jobLocation: {
    fontSize: 16,
  },
  loading: {
    alignItems: "center",
    justifyContent: "center",
    margin: 10,
  },
});
